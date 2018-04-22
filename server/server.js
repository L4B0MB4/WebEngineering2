const express = require("express");
const http = require("http");
const path = require("path");
import {Blockchain} from "./blockchain";

const blockchain = new Blockchain();
const exp = express();
const fileUpload = require("express-fileupload");
const NodeRSA = require("node-rsa");
const rsaKeys = new NodeRSA({b: 512});
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
const nodemailer = require('nodemailer');

const server = http.createServer(exp);

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "golddiggerio420",
        pass: "G0lddiggerio."
    }
});

var rand, saveBody;

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
exp.use(bodyParser.urlencoded({extended: true}));
exp.use(flash());
passport.serializeUser(async (user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});
passport.use(
    new LocalStrategy(async function (username, password, done) {
        let user = await databaseutils.login(username, password);
        if (user) {
            return done(null, user);
        } else {
            return done({message: "Error while logging in"});
        }
    })
);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({dev});
const handle = app.getRequestHandler();
exp.use(bodyParser.urlencoded({extended: false}));
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
        exp.get("/impressum", ensureAuthenticated, async (req, res) => {
            const query = await commonutils.setUpMain(req, res, blockchain);
            return app.render(req, res, "/impressum", query);
        });
        exp.get("/about", ensureAuthenticated, async (req, res) => {
            const query = await commonutils.setUpMain(req, res, blockchain);
            return app.render(req, res, "/about", query);
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

        exp.get("/api/blockchain/getUserFeed", ensureAuthenticated, async (req, res) => {
            if (!req.query.username) return res.json({});
            const visitedUser = await databaseutils.findPublicKeyByUsername(req.query.username);
            const feed = await blockchainutils.getContentOfUser(blockchain.chain, visitedUser.publicKey);
            res.json(feed);
        });
        exp.get("/api/blockchain/getUserFollower", ensureAuthenticated, async (req, res) => {
            if (!req.query.username) return res.json({});
            const visitedUser = await databaseutils.findPublicKeyByUsername(req.query.username);
            res.json(await blockchainutils.getFollower(blockchain.chain, visitedUser.publicKey));
        });
        exp.get("/api/blockchain/getUserAnsehen", ensureAuthenticated, async (req, res) => {
            if (!req.query.username) return res.json({});
            const visitedUser = await databaseutils.findPublicKeyByUsername(req.query.username);
            res.json(await blockchainutils.getAnsehen(blockchain.chain, visitedUser.publicKey));
        });
        exp.get("/api/blockchain/getUserLikes", ensureAuthenticated, async (req, res) => {
            if (!req.query.username) return res.json({});
            const visitedUser = await databaseutils.findPublicKeyByUsername(req.query.username);
            res.json(await blockchainutils.getLikesByUser(blockchain.chain, visitedUser.publicKey));
        });
        exp.get("/api/blockchain/getFollowerFeed", ensureAuthenticated, ensureAuthenticated, async (req, res) => {
            const following = await blockchainutils.getFollowing(blockchain.chain, req.user.publicKey);
            const feed = await blockchainutils.createFollowerFeed(req, res, blockchain.chain, following);
            res.json(feed);
        });
        exp.get("/api/blockchain/getFeaturedUsers", ensureAuthenticated, async (req, res) => {
            let users = await blockchainutils.getFeaturedUsers(blockchain.chain);
            res.json(users);
        });

        exp.post("/api/user/login", function (req, res, next) {
            passport.authenticate("local", (err, user, info) => serverutils.handleLogin(err, user, info, req, res))(req, res, next);
        });

        exp.post("/api/user/register", (req, res) => {
            if (!req.body.name || !req.body.email || !req.body.publicKey || !req.body.privateKey || !req.body.password) {
                return res.json({type: "error", message: "Please fill in all the necessary fields!"});
            } else {
                saveBody = req.body;
                rand = Math.floor((Math.random() * 100) + 54);
                let link = "http://localhost:3000/api/user/verify?id=" + rand;
                let mailOptions = {
                    to: req.body.email,
                    subject: "Please verify your new Account for golddigger.io",
                    html: "Dear new user, <br> Welcome to the crew! We wish you happy digging and hope you will have fun on our platform. But" +
                    " first of all we need you to confirm your registration by clicking on the following link: <br><a href="+link+">Click" +
                    " here to verify </a> <br> Thank you and best regards, <br> The Golddigger Gang"
                }
                smtpTransport.sendMail(mailOptions, function (err, res) {
                    if (err) throw err;
                    console.log("Message sent");
                });
            }
        });

        exp.get("/api/user/verify", function (req, res) {
            if (req.query.id == rand) {
                databaseutils.register(saveBody.email, saveBody, res);
            } else {
                console.log("Error verifying. Please try again!");
            }
        });

        exp.get("/api/user/getUser", ensureAuthenticated, async (req, res) => {
            let user = blockchainutils.getUserWithProfilePicture(blockchain.chain, req.user);
            user.ansehen = await blockchainutils.getAnsehen(blockchain.chain, user.publicKey);
            res.json(user);
        });

        exp.get("/api/user/getAllUsers", ensureAuthenticated, async (req, res) => {
            let users = await databaseutils.printAllUsers();
            res.json(users);
        });

        exp.post("/api/user/getPublicKey", ensureAuthenticated, async (req, res) => {
            if (!req.body.username) return res.json({type: "error", message: "Benutzername fehlt!"});
            let user = await databaseutils.findPublicKeyByUsername(req.body.username);
            res.json(user);
        });

        exp.get("/api/user/search", ensureAuthenticated, async (req, res) => {
            if (!req.query.username) res.json({message: "no user fund"});
            const resp = await databaseutils.findUserByUsername(req.query.username);
            res.json(resp);
        });

        exp.post("/api/uploadPicture", ensureAuthenticated, function (req, res) {
            commonutils.setUpPictureUpload(req, res);
        });

        exp.post("/api/uploadExternalPicture", ensureAuthenticated, function (req, res) {
            commonutils.setExternalPictureUpload(req, res);
        });

        exp.get("/api/picture/:filename", ensureAuthenticated, (req, res) => {
            let p = path.resolve(`${__dirname}/../temp/`);
            res.sendFile(`${p}/${req.params.filename}`);
        });

        exp.get("/logout", ensureAuthenticated, function (req, res) {
            req.logout();
            res.redirect("/");
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
