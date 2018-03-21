const mongoUrl = "mongodb://localhost:27017/local";
const {MongoClient} = require('mongodb');
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
const saveUser = (id, user) =>
    new Promise((resolve, reject) => {
        const now = Date.now();
        db.collection("users").findOne({_id: id}, {}, (err, res) => {
            if (err) {
                reject(err);
            }
            if (res !== null) {
                db
                    .collection("users")
                    .updateOne({_id: id}, {user, lastUpdate: now}, (e, r) => {
                        if (e) throw e;
                        resolve(user);
                    });
            } else {
                db.collection("users").save(
                    {
                        _id: id,
                        user,
                        lastUpdate: now,
                        created: now
                    },
                    {w: 1},
                    resolve
                );
            }
        });
    });

const login = (email, password) => {
    new Promise((resolve, reject) => {
        db.collection("users").findOne({
            $or: [{
                email: email
            }, {
                name: email
            }]}, {}, (err, res) => {
            console.log("Successfully logged in: ", res);
        })}
    );
};

const register = (email, password) => {
    new Promise((resolve, reject) => {
        db.collection("users").findOne({email: email}, {}, (err, res) => {
            console.log(res);
            var newUser = {email: email, password:password};
            db.collection("users").insertOne(newUser, function (err, res) {
                if (err) throw err;
                console.log("1 Document inserted: ", newUser);
            });
        })}
    );
};

const saveBlockchain = (blockchain) =>
    new Promise((resolve, reject) => {
        const id = 1;
        const now = Date.now();
        db.collection("blockchain").findOne({_id: id}, {}, (err, res) => {
            if (err) {
                reject(err);
            }
            if (res !== null) {
                db
                    .collection("blockchain")
                    .updateOne({_id: id}, {blockchain, lastUpdate: now}, (e, r) => {
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
                    {w: 1},
                    resolve
                );
            }
        });
    });


const getBlockchain = () =>
    // this is using the same db connection
    new Promise((resolve, reject) => {
        db.collection('blockchain').findOne({}, (err, docs) => {
            if (err) {
                reject(err);
            }
            // do something
            resolve(docs);
        });
    });


module.exports = {
    connect,
    saveUser,
    getBlockchain,
    saveBlockchain,
    login,
    register
};
