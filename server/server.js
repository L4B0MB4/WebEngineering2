const express = require("express");
const http = require("http");
const path = require("path");
import { Blockchain } from "./blockchain";
const blockchain = new Blockchain();
const exp = express();
const fileUpload = require("express-fileupload");
const NodeRSA = require("node-rsa");
const rsaKeys = new NodeRSA({ b: 512 });
import * as serverutils from "./serverutils";
import * as blockchainutils from "./blockchainutils";
import * as websocketutils from "./websockets";
import * as commonutils from "./commonutils";
const MongoClient = require("mongodb").MongoClient;
import * as databaseutils from "./database";
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");

const server = http.createServer(exp);

const secret = {
  value: Math.random()
};
function setCurrentSecret() {
  secret.value = Math.random();
}
var socketsConnected = 0;
const sockets = [];

setInterval(setCurrentSecret, 5000);
websocketutils.startWebsockets(server, socketsConnected, blockchain, databaseutils, serverutils, rsaKeys, secret, sockets);
exp.use(bodyParser.json());
exp.use(bodyParser.urlencoded({ extended: true }));
exp.use(flash());
passport.serializeUser(async (user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
passport.use(
  new LocalStrategy(async function(username, password, done) {
    let user = await databaseutils.login(username, password);
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

/*
starting the real server
*/
app
  .prepare()
  .then(async () => {
    exp.use(express.static("./static/"));
    const database = await databaseutils.connect();
    const chain = await databaseutils.getBlockchain();
    if (chain !== null) {
      blockchain.chain = chain.blockchain;
    }

    exp.get("/index", (req, res) => {
      res.redirect("/");
    });

    exp.get("/", ensureAuthenticated, async (req, res) => {
      const query = await commonutils.setUpMain(req, res, blockchain);
      return app.render(req, res, "/index", query);
    });
    exp.get("/profile", ensureAuthenticated, async (req, res) => {
      const query = await commonutils.setUpProfile(req, res, blockchain);
      return app.render(req, res, "/profile", query);
    });
    exp.get("/featured", ensureAuthenticated, async (req, res) => {
      const query = await commonutils.setUpMain(req, res, blockchain);
      return app.render(req, res, "/featured", query);
    });

    exp.get("/visit/:username", ensureAuthenticated, async (req, res) => {
      const query = await commonutils.setUpVisitPage(req, res, blockchain);
      return app.render(req, res, "/visitorpage", query);
    });

    exp.get("/api/blockchain/feed", async (req, res) => {
      let feed = await blockchainutils.createFeed(req, res, blockchain.chain);
      res.json(feed);
    });

    exp.get("/api/blockchain/getUserFeed", async (req, res) => {
      if (!req.query.username) return res.json({});
      const visitedUser = await databaseutils.findPublicKeyByUsername(req.query.username);
      const feed = await blockchainutils.getContentOfUser(blockchain.chain, visitedUser.publicKey);
      res.json(feed);
    });
    exp.get("/api/blockchain/getUserFollower", async (req, res) => {
      if (!req.query.username) return res.json({});
      const visitedUser = await databaseutils.findPublicKeyByUsername(req.query.username);
      res.json(await blockchainutils.getFollower(blockchain.chain, visitedUser.publicKey));
    });
    exp.get("/api/blockchain/getUserAnsehen", async (req, res) => {
      if (!req.query.username) return res.json({});
      const visitedUser = await databaseutils.findPublicKeyByUsername(req.query.username);
      res.json(await blockchainutils.getAnsehen(blockchain.chain, visitedUser.publicKey));
    });
    exp.get("/api/blockchain/getUserLikes", async (req, res) => {
      if (!req.query.username) return res.json({});
      const visitedUser = await databaseutils.findPublicKeyByUsername(req.query.username);
      res.json(await blockchainutils.getLikesByUser(blockchain.chain, visitedUser.publicKey));
    });
    exp.get("/api/blockchain/getFollowerFeed", async (req, res) => {
      if (!req.query.username) return res.json({});
      const visitedUser = await databaseutils.findPublicKeyByUsername(req.query.username);
      const following = await blockchainutils.getFollowing(blockchain.chain, visitedUser.publicKey);
      const feed = await blockchainutils.createFollowerFeed(req, res, blockchain.chain, following);
      res.json(feed);
    });
    exp.get("/api/blockchain/getFeaturedUsers", async (req, res) => {
      let users = await blockchainutils.getFeaturedUsers(blockchain.chain);
      res.json(users);
    });

    exp.post("/api/user/login", function(req, res, next) {
      passport.authenticate("local", (err, user, info) => serverutils.handleLogin(err, user, info, req, res))(req, res, next);
    });

    exp.post("/api/user/register", (req, res) => {
      if (!req.body.name || !req.body.email || !req.body.publicKey || !req.body.privateKey || !req.body.password) {
        return res.json({ type: "error", message: "Bitte alles ausfüllen!" });
      } else {
        databaseutils.register(req.body.email, req.body, res);
      }
    });

    exp.get("/api/user/getUser", async (req, res) => {
      let user = blockchainutils.getUserWithProfilePicture(blockchain.chain, req.user);
      res.json(user);
    });

    exp.get("/api/user/getAllUsers", async (req, res) => {
      let users = await databaseutils.printAllUsers();
      res.json(users);
    });

    exp.post("/api/user/getPublicKey", async (req, res) => {
      if (!req.body.username) return res.json({ type: "error", message: "Benutzername fehlt!" });
      let user = await databaseutils.findPublicKeyByUsername(req.body.username);
      res.json(user);
    });

    exp.post("/api/uploadPicture", function(req, res) {
      commonutils.setUpPictureUpload(req, res);
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
