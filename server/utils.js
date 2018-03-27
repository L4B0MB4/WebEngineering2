const _ = require("lodash");
const { findUsersByPublicKey } = require("./database");

async function createFeed(req, res, blockchain) {
  let feed = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  feed = _.filter(feed, { value: { type: "content" } });
  feed = feed.map(item => {
    let x = {
      ...item.value,
      recipient: item.recipient,
      previousHash: item.previousHash
    };
    return x;
  });
  feed.slice(Math.max(feed.length - 10, 1));
  let publicKeys = feed.map(item => item.recipient);
  let users = await findUsersByPublicKey(publicKeys);
  feed = feed.map(block => mergeUserToBlock(block, users));
  for (let i = 0; i < feed.length; i++) {
    feed[i].likes = await getLikesByPreviousHash(
      blockchain,
      feed[i].previousHash
    );
  }
  return feed.reverse();
}

function mergeUserToBlock(block, users) {
  for (let i = 0; i < users.length; i++) {
    if (block.recipient === users[i].publicKey) {
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
      sender: undefined,
      recipient: undefined
    };
  });
  let arr = _.filter(blockchain, {
    value: { type: "like", data: { previousHash: hash } }
  });
  let publicKeys = arr.map(item => item.value.data.userKey);
  let users = await findUsersByPublicKey(publicKeys);
  arr = arr.map(block => mergeUserToTransaction(block, users).user);
  return arr;
}

function mergeUserToTransaction(block, users) {
  for (let i = 0; i < users.length; i++) {
    if (block.value.data.userKey === users[i].publicKey) {
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
  feed = _.filter(feed, { value: { type: "content" }, recipient:publicKey });
  feed = feed.map(item => {
    let x = {
      ...item.value,
      recipient: item.recipient,
      previousHash: item.previousHash
    };
    return x;
  });
  feed.slice(Math.max(feed.length - 20, 1));
  for (let i = 0; i < feed.length; i++) {
    feed[i].likes = await getLikesByPreviousHash(
      blockchain,
      feed[i].previousHash
    );
  }
  return feed.reverse();
  return feed;
}


async function getFollower(blockchain,publicKey)
{
  let feed = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  feed = _.filter(feed, { value: { type: "follow", data:{following:publicKey} } });
  feed = feed.map(item => {
    let x = {
      ...item.value,
      recipient: item.recipient,
      previousHash: item.previousHash
    };
    return x;
  });
  let publicKeys = feed.map(item => item.recipient);
  let users = await findUsersByPublicKey(publicKeys);
  feed = feed.map(block => mergeUserToBlock(block, users));
  return feed;
}

module.exports = {
  createFeed,
  handleLogin,
  mergeUserToBlock,
  broadcastOrEmit,
  getLikesByPreviousHash,
  getContentOfUser,
  getFollower
};
