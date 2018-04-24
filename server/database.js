const mongoUrl = "mongodb://127.0.0.1:27017/local";
const { MongoClient } = require("mongodb");
let db;

const connect = () => {
    if (db) {
        return Promise.resolve(db);
    }
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoUrl, (err, database) => {
            if (err) reject(err);
            db = database;
            resolve(db);
        });
    });
};

const login = (email, password) => {
    return new Promise((resolve, reject) => {
        db.collection("users").findOne(
            {
                $or: [
                    {
                        email,
                        password
                    },
                    {
                        name: email,
                        password
                    }
                ],
                verified: true
            },
            {},
            (err, res) => {
                if (res) {
                    resolve(res);
                } else {
                    resolve(null);
                }
            }
        );
    });
};

const register = (email, name, httpRes) => {
    return new Promise((resolve, reject) => {
        db.collection("users").findOne({ $or: [{ email }, { name: name }] }, {}, (err, res) => {
            let saver = res;
            db.collection("users").deleteOne({ name: res.name }, (err, res) => {
                if (err) throw error;
                console.log("Successfully deleted");
            });
            if (saver.verified === false) {
                var newUser = {
                    email: saver.email,
                    name: saver.name,
                    publicKey: saver.publicKey,
                    privateKey: saver.privateKey,
                    password: saver.password,
                    verified: true
                };
                db.collection("users").insertOne(newUser, function (err, res) {
                    if (err) throw err;
                    return httpRes.json({
                        type: "success",
                        message: "Successfully registered"
                    });
                });
            } else {
                return httpRes.json({ type: "error", message: "Email already exists!" });
            }
        });
    });
};

const unverifiedRegister = (email, body, rand, httpRes) => {
    return new Promise((resolve, reject) => {
        db.collection("users").findOne({ $or: [{ email }, { name: body.name }] }, {}, (err, res) => {
            if (res === null) {
                var newUser = {
                    email: body.email,
                    name: body.name,
                    publicKey: body.publicKey,
                    privateKey: body.privateKey,
                    password: body.password,
                    verified: false,
                    rand: rand
                };
                db.collection("users").insertOne(newUser, function (err, res) {
                    if (err) throw err;
                    return httpRes.json({
                        type: "info",
                        message: "An Email has been sent. In order to log in with your new Account, go into your email account and click on the link."
                    });
                });
            } else {
                return httpRes.json({ type: "error", message: "Email already exists!" });
            }
        });
    });
};

const printAllUsers = () => {
    return new Promise((resolve, reject) => {
        db
            .collection("users")
            .find({})
            .toArray(function (err, res) {
                if (err) throw err;
                let users = res;
                resolve(users);
            });
    });
};

const saveBlockchain = blockchain =>
    new Promise((resolve, reject) => {
        const id = 1;
        const now = Date.now();
        db.collection("blockchain").findOne({ _id: id }, {}, (err, res) => {
            if (err) {
                reject(err);
            }
            if (res !== null) {
                db.collection("blockchain").updateOne({ _id: id }, { blockchain, lastUpdate: now }, (e, r) => {
                    if (e) throw e;
                    resolve(blockchain);
                });
            } else {
                db.collection("blockchain").save(
                    {
                        _id: id,
                        blockchain,
                        lastUpdate: now,
                        created: now
                    },
                    { w: 1 },
                    resolve
                );
            }
        });
    });

const getBlockchain = () =>
    // this is using the same db connection
    new Promise((resolve, reject) => {
        db.collection("blockchain").findOne({}, (err, docs) => {
            if (err) {
                reject(err);
            }
            // do something
            resolve(docs);
        });
    });

const findUsersByPublicKey = publicKeys =>
    new Promise((resolve, reject) => {
        db
            .collection("users")
            .find({ publicKey: { $in: [...publicKeys] } }, { name: 1, publicKey: 1 })
            .toArray((err, res) => {
                if (err) reject(err);
                resolve(res);
            });
    });


const findUnverifiedUser = (name, rand) =>
    new Promise((resolve, reject) => {
        db
            .collection("users")
            .findOne({ name: name, verified: false }, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
    });

const findUserByUsername = username =>
    new Promise((resolve, reject) => {
        db
            .collection("users")
            .find({ name: username }, { name: 1 })
            .toArray((err, res) => {
                if (err) reject(err);
                resolve(res);
            });
    });

const findUserByEmail = email =>
    new Promise((resolve, reject) => {
        db
            .collection("users")
            .find({ email: email }, { email: 1 })
            .toArray((err, res) => {
                if (err) reject(err);
                resolve(res);
            });
    });

const findSingleUsernameByPublicKey = publicKey =>
    new Promise((resolve, reject) => {
        db
            .collection("users")
            .findOne({ publicKey: publicKey }, { name: 1 }, (err, res) => {
                if (err) reject(err);
                resolve(res.name);
            });
    });

const findPublicKeyByUsername = name =>
    new Promise((resolve, reject) => {
        db.collection("users").findOne({ name }, { name: 1, publicKey: 1 }, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });

module.exports = {
    connect,
    getBlockchain,
    saveBlockchain,
    login,
    unverifiedRegister,
    register,
    printAllUsers,
    findUsersByPublicKey,
    findUnverifiedUser,
    findSingleUsernameByPublicKey,
    findPublicKeyByUsername,
    findUserByUsername,
    findUserByEmail
};
