const _ = require("lodash");
const { findUsersByPublicKey } = require("./database");

async function createFeed(req, res, blockchain) {
  let feed = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  feed = _.filter(feed, { type: "content" });
  feed.slice(Math.max(feed.length - 10, 1));
  let publicKeys = feed.map(item => item.sender);
  let users = await findUsersByPublicKey(publicKeys);
  feed = feed.map(block => mergeUserToBlock(block, users));
  for (let i = 0; i < feed.length; i++) {
    feed[i].likes = await getLikesByPreviousHash(blockchain, feed[i].previousHash);
  }
  return feed.reverse();
}

function mergeUserToBlock(block, users) {
  for (let i = 0; i < users.length; i++) {
    if (block.sender === users[i].publicKey) {
      block.user = {
        ...users[i],
        _id: undefined,
        publicKey: undefined
      };
      return block;
    }
  }
  return block;
}

function handleLogin(err, user, info, req, res) {
  if (err) {
    res.json({ type: "error", message: "Fehler beim Login" });
  }
  if (!user) {
    res.json({ type: "error", message: "Fehler beim Login" });
  }
  req.logIn(user, function(err) {
    if (err) {
      res.json({ type: "error", message: "Fehler beim Login" });
    }
    return res.json({
      type: "success",
      message: "Erfolgreich eingeloggt"
    });
  });
}

function broadcastOrEmit(socket, type, data, socketcount) {
  if (socketcount < 2) {
    socket.emit(type, data);
  } else {
    socket.broadcast.emit(type, data);
  }
}

async function getLikesByPreviousHash(blockchain, hash) {
  blockchain = blockchain.map(item => {
    return {
      ...item.transactions[0],
      previousHash: item.previousHash,
      sender: undefined
    };
  });
  let arr = _.filter(blockchain, {
    type: "like",
    data: { previousHash: hash }
  });
  let publicKeys = arr.map(item => item.data.userKey);
  let users = await findUsersByPublicKey(publicKeys);
  arr = arr.map(block => mergeUserToTransaction(block, users).user);
  return arr;
}

function mergeUserToTransaction(block, users) {
  for (let i = 0; i < users.length; i++) {
    if (block.data.userKey === users[i].publicKey) {
      block.user = {
        ...users[i],
        _id: undefined,
        publicKey: undefined
      };
      return block;
    }
  }
  return block;
}

async function getContentOfUser(blockchain, publicKey) {
  let feed = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  feed = _.filter(feed, { type: "content", sender: publicKey });
  feed.slice(Math.max(feed.length - 20, 1));
  for (let i = 0; i < feed.length; i++) {
    feed[i].likes = await getLikesByPreviousHash(blockchain, feed[i].previousHash);
  }
  return feed.reverse();
}

async function getFollower(blockchain, publicKey) {
  let feed = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  feed = _.filter(feed, {
    type: "follow",
    data: { following: publicKey }
  });
  let publicKeys = feed.map(item => item.sender);
  let users = await findUsersByPublicKey(publicKeys);
  feed = feed.map(block => mergeUserToBlock(block, users));
  return feed;
}

function getAnsehen(blockchain, publicKey) {
  const transactions = blockchain.map(item => item.transactions[0]);
  const rewardTransactions = blockchain.map(item => item.transactions[1]);
  let likes = _.filter(transactions, { type: "like", data: { userKey: publicKey } });
  //let shares = _.filter(transactions, { type: "like" });
  let miningRewards = _.filter(rewardTransactions, { data: { userKey: publicKey } });
  return likes.length + miningRewards.length;
}

module.exports = {
  createFeed,
  handleLogin,
  mergeUserToBlock,
  broadcastOrEmit,
  getLikesByPreviousHash,
  getContentOfUser,
  getFollower,
  getAnsehen
};
