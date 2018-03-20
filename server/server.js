const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
import { Blockchain } from "../components/utils/blockchain";
const blockchain = new Blockchain();
const exp = express();
const NodeRSA = require("node-rsa");
const rsaKeys = new NodeRSA({ b: 512 });
const { createFeed } = require("./utils");
const MongoClient = require("mongodb").MongoClient;
const { saveUser, connect } = require("./database");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const session = require("express-session");

const secrect = {
  value: Math.random()
};

function setCurrentSecret() {
  secrect.value = Math.random();
}

setInterval(setCurrentSecret, 5000);

const server = http.createServer(exp);

const io = socketIO(server);

io.on("connection", socket => {
  socket.emit("blockchain", blockchain.chain);

  socket.on("get transaction code", publicKey => {
    rsaKeys.importKey(publicKey, "public");
    let encrypted = rsaKeys.encrypt(secrect.value, "base64");
    socket.emit("solve transaction code", encrypted);
  });

  socket.on("new transaction", data => {
    const transaction = {
      sender: data.sender,
      recipient: data.recipient,
      value: data.value
    };
    socket.broadcast.emit("mine", transaction);
  });

  socket.on("new block", block => {
    let test_chain = [];
    test_chain.push(...blockchain.chain);
    test_chain.push(block);
    if (blockchain.valid_chain(test_chain) === true) {
      blockchain.chain = test_chain;
      socket.broadcast.emit("get blockchain", blockchain.chain);
      socket.emit("get blockchain", blockchain.chain);
    }
  });
  socket.on("get blockchain", () => {
    socket.emit("get blockchain", blockchain.chain);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

passport.serializeUser(async (user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log("hier");
    console.log(username);
    done(null, { username });
  })
);

const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

exp.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
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
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
app
  .prepare()
  .then(async () => {
    const database = await connect();

    exp.get("/", async (req, res) => {
      const query = {
        value: "Hey so schickt man daten von server zu den pages"
      };
      await saveUser(1, { name: "testbenutzer", password: "passworthash" });
      return app.render(req, res, "/index", query);
    });

    exp.post(
      "/login",
      passport.authenticate("local", {
        successRedirect: "/sucess",
        failureRedirect: "/login",
        failureFlash: true
      })
    );

    exp.get("/api/feed", ensureAuthenticated, (req, res) => {
      res.json(createFeed(req, res, blockchain.chain));
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
