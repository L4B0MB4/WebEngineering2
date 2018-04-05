const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
import { Blockchain } from "./blockchain";
const blockchain = new Blockchain();
const exp = express();
const fileUpload = require("express-fileupload");
const NodeRSA = require("node-rsa");
const rsaKeys = new NodeRSA({ b: 512 });
const {
  createFeed,
  handleLogin,
  mergeUserToBlock,
  broadcastOrEmit,
  getLikesByPreviousHash,
  getContentOfUser,
  getFollower,
  getAnsehen,
  hasEnoughAnsehen,
  createFollowerFeed,
  getFollowing,
  getUserWithProfilePicture,
  getLikedContent
} = require("./utils");
const MongoClient = require("mongodb").MongoClient;
const {
  connect,
  saveBlockchain,
  getBlockchain,
  login,
  register,
  printAllUsers,
  findUsersByPublicKey,
  findPublicKeyBy,
  findPublicKeyByUsername
} = require("./database");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");

const secret = {
  value: Math.random()
};
function setCurrentSecret() {
  secret.value = Math.random();
}
var socketsConnected = 0;
setInterval(setCurrentSecret, 5000);
const server = http.createServer(exp);
const io = socketIO(server);
exp.use(bodyParser.json());
exp.use(bodyParser.urlencoded({ extended: true }));
exp.use(flash());

io.on("connection", socket => {
  socketsConnected++;
  socket.emit("blockchain", blockchain.chain);

  socket.on("get transaction code", publicKey => {
    rsaKeys.importKey(publicKey, "public");
    let encrypted = rsaKeys.encrypt(secret.value, "base64");
    socket.emit("solve transaction code", encrypted);
  });

  socket.on("new transaction", async data => {
    const transaction = {
      sender: data.sender,
      type: data.type,
      data: data.data,
      timestamp: data.timestamp
    };
    if ((data.type === "share" && hasEnoughAnsehen(blockchain.chain, data.sender, 1)) || data.type !== "share") {
      broadcastOrEmit(socket, "mine", transaction, socketsConnected);
    }
  });

  socket.on("new block", async block => {
    let test_chain = [];
    test_chain.push(...blockchain.chain);
    test_chain.push(block);
    if (blockchain.valid_chain(test_chain) === true) {
      blockchain.chain = test_chain;
      socket.broadcast.emit("get blockchain", blockchain.chain);
      socket.emit("get blockchain", blockchain.chain);
      await saveBlockchain(blockchain.chain);
    }
  });
  socket.on("get blockchain", () => {
    socket.emit("get blockchain", blockchain.chain);
  });

  socket.on("disconnect", () => {
    socketsConnected--;
  });
});

passport.serializeUser(async (user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new LocalStrategy(async function (username, password, done) {
    let user = await login(username, password);
    if (user) {
      return done(null, user);
    } else {
      return done({ message: "Error while logging in" });
    }
  })
);

const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

exp.use(bodyParser.urlencoded({ extended: false }));

exp.use(bodyParser.json());

exp.use(
  session({
    secret: "RH9eRdcy4aQGxE*ddCeB^K6e?24j-hwc=S8Y",
    resave: false,
    saveUninitialized: false
  })
);

exp.use(passport.initialize());
exp.use(passport.session());
exp.use(fileUpload());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
app
  .prepare()
  .then(async () => {
    exp.use(express.static("./static/"));
    const database = await connect();
    const chain = await getBlockchain();
    if (chain !== null) {
      blockchain.chain = chain.blockchain;
    }

    exp.get("/index", (req, res) => {
      res.redirect("/");
    });

    exp.get("/", ensureAuthenticated, async (req, res) => {
      const following = await getFollowing(blockchain.chain, req.user.publicKey);
      let user = getUserWithProfilePicture(blockchain.chain, req.user);
      user.ansehen = getAnsehen(blockchain.chain, user.publicKey);
      const query = {
        blockchainFeed: await createFollowerFeed(req, res, blockchain.chain, following),
        userContent: await getContentOfUser(blockchain.chain, req.user.publicKey),
        followers: await getFollower(blockchain.chain, req.user.publicKey),
        ansehen: getAnsehen(blockchain.chain, req.user.publicKey),
        user
      };
      return app.render(req, res, "/index", query);
    });

    exp.get("/visit/:username", ensureAuthenticated, async (req, res) => {
      let query = {
        ...req.params
      };
      let visitedUser = await findPublicKeyByUsername(query.username);
      visitedUser = getUserWithProfilePicture(blockchain.chain, visitedUser);
      visitedUser.ansehen = getAnsehen(blockchain.chain, visitedUser.publicKey);
      let user = getUserWithProfilePicture(blockchain.chain, req.user);
      user.ansehen = getAnsehen(blockchain.chain, user.publicKey);
      query = {
        user,
        visitedUser
      };
      return app.render(req, res, "/visitorpage", query);
    });

    exp.get("/api/blockchain/feed", async (req, res) => {
      let feed = await createFeed(req, res, blockchain.chain);
      res.json(feed);
    });

    exp.get("/api/blockchain/getUserFeed", async (req, res) => {
      if (!req.query.username) return res.json({});
      const visitedUser = await findPublicKeyByUsername(req.query.username);
      const feed = await getContentOfUser(blockchain.chain, visitedUser.publicKey);
      res.json(feed);
    });
    exp.get("/api/blockchain/getUserFollower", async (req, res) => {
      if (!req.query.username) return res.json({});
      const visitedUser = await findPublicKeyByUsername(req.query.username);
      res.json(await getFollower(blockchain.chain, visitedUser.publicKey));
    });
    exp.get("/api/blockchain/getUserAnsehen", async (req, res) => {
      if (!req.query.username) return res.json({});
      const visitedUser = await findPublicKeyByUsername(req.query.username);
      res.json(await getAnsehen(blockchain.chain, visitedUser.publicKey));
    });
    exp.get("/api/blockchain/getFollowerFeed", async (req, res) => {
      if (!req.query.username) return res.json({});
      const visitedUser = await findPublicKeyByUsername(req.query.username);
      const following = await getFollowing(blockchain.chain, visitedUser.publicKey);
      const feed = await createFollowerFeed(req, res, blockchain.chain, following);
      res.json(feed);
    });

    exp.post("/api/user/login", function (req, res, next) {
      passport.authenticate("local", (err, user, info) => handleLogin(err, user, info, req, res))(req, res, next);
    });

    exp.post("/api/user/register", (req, res) => {
      if (!req.body.name || !req.body.email || !req.body.publicKey || !req.body.privateKey || !req.body.password) {
        return res.json({ type: "error", message: "Bitte alles ausfüllen!" });
      } else {
        register(req.body.email, req.body, res);
      }
    });

    exp.get("/api/user/getAllUsers", async (req, res) => {
      let users = await printAllUsers();
      res.json(users);
    });

    exp.post("/api/user/getPublicKey", async (req, res) => {
      if (!req.body.username) return res.json({ type: "error", message: "Benutzername fehlt!" });
      let user = await findPublicKeyByUsername(req.body.username);
      res.json(user);
    });

    exp.post("/api/uploadPicture", function (req, res) {
      if (!req.files || !req.files.uploadedFile) return res.status(400).json({ message: "No / Wrong files were uploaded." });
      const file = req.files.uploadedFile;
      const filename = file.md5 + Date.now();
      file.mv(`${__dirname}/../temp/${filename}`, function (err) {
        if (err) return res.status(500).send(err);
        res.send({ filename });
      });
    });

    exp.get("/api/picture/:filename", (req, res) => {
      let p = path.resolve(`${__dirname}/../temp/`);
      res.sendFile(`${p}/${req.params.filename}`);
    });

    exp.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
