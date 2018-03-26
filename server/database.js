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
        ]
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

const register = (email, body, httpRes) => {
  return new Promise((resolve, reject) => {
    db
      .collection("users")
      .findOne({ $or: [{ email }, { name: body.name }] }, {}, (err, res) => {
        if (res === null) {
          var newUser = {
            email: body.email,
            name: body.name,
            publicKey: body.publicKey,
            privateKey: body.privateKey,
            password: body.password
          };
          db.collection("users").insertOne(newUser, function(err, res) {
            if (err) throw err;
            httpRes.json({
              type: "success",
              message: "Erfolgreich registriert"
            });
          });
        } else {
          httpRes.json({ type: "error", message: "Email bereits vorhanden!" });
        }
      });
  });
};

const printAllUsers = () => {
  return new Promise((resolve, reject) => {
    db
      .collection("users")
      .find({})
      .toArray(function(err, res) {
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
        db
          .collection("blockchain")
          .updateOne({ _id: id }, { blockchain, lastUpdate: now }, (e, r) => {
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

const findPublicKeyByUsername = name =>
  new Promise((resolve, reject) => {
    db
      .collection("users")
      .findOne({ name }, { name: 1, publicKey: 1 }, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
  });

module.exports = {
  connect,
  getBlockchain,
  saveBlockchain,
  login,
  register,
  printAllUsers,
  findUsersByPublicKey,
  findPublicKeyByUsername
};
