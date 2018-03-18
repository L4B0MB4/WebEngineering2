const mongoUrl = "mongodb://localhost:27017/local";
const { MongoClient } = require('mongodb');
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
const saveUser = (id,user) =>
  new Promise((resolve, reject) => {
    const now = Date.now();
    db.collection("users").findOne({ _id: id }, {}, (err, res) => {
      if (err) {
        reject(err);
      }
      if (res !== null) {
        db
          .collection("users")
          .updateOne({ _id: id }, { user, lastUpdate: now }, (e, r) => {
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
          { w: 1 },
          resolve
        );
      }
    });
  });

module.exports = {
    connect,
  saveUser,
};
