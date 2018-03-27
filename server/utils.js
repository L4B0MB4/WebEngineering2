const _ = require("lodash");
const { findUsersByPublicKey } = require("./database");

async function createFeed(req, res, blockchain) {
  let filtered = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  const feedshares = getShares(blockchain, filtered);
  let feed = _.filter(filtered, { type: "content" });
  feed.push(...feedshares);
  feed.sort(sortByTimestamp);
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

function getBlockByPreviousHash(blockchain, hash) {
  let x = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  x = _.filter(x, { previousHash: hash });
  if (x.length > 0) return x[0];
  else return null;
}

function getShares(blockchain, filteredchain) {
  let feedshares = _.filter(filteredchain, { type: "share" });
  feedshares = feedshares.map(item => {
    return {
      ...item,
      type: "content",
      data: getBlockByPreviousHash(blockchain, item.data.previousHash).data,
      shared: true
    };
  });
  return feedshares;
}

function sortByTimestamp(a, b) {
  if (a.timestamp > b.timestamp) {
    return 1;
  }
  if (a.timestamp < b.timestamp) {
    return -1;
  }
  return 0;
}

async function getContentOfUser(blockchain, publicKey) {
  let filtered = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  let feed = _.filter(filtered, { type: "content", sender: publicKey });
  const feedshares = _.filter(getShares(blockchain, filtered), { sender: publicKey });
  feed.push(...feedshares);
  feed.sort(sortByTimestamp);
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
  let miningRewards = _.filter(rewardTransactions, { data: { userKey: publicKey } });
  let foreignshares = _.filter(transactions, { type: "share", data: { userKey: publicKey } });
  let ownshares = _.filter(transactions, { type: "share", sender: publicKey });
  return likes.length + miningRewards.length + foreignshares.length - ownshares.length;
}

function hasEnoughAnsehen(blockchain, publicKey, amount) {
  let ansehen = getAnsehen(blockchain, publicKey);
  return ansehen >= amount;
}

module.exports = {
  createFeed,
  handleLogin,
  mergeUserToBlock,
  broadcastOrEmit,
  getLikesByPreviousHash,
  getContentOfUser,
  getFollower,
  getAnsehen,
  hasEnoughAnsehen
};
