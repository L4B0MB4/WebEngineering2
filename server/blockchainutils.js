const _ = require("lodash");
const { findUsersByPublicKey } = require("./database");

async function createFeed(req, res, blockchain) {
  let filtered = getChainByTime(blockchain);
  filtered = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  const feedshares = getShares(blockchain, filtered);
  let feed = _.filter(filtered, { type: "content" });
  feed.push(...feedshares);
  feed.sort(sortByTimestamp);
  feed.slice(Math.max(feed.length - 10, 1));
  let publicKeys = feed.map(item => item.sender);
  let users = await findUsersByPublicKey(publicKeys);
  feed = feed.map(block => mergeUserToBlock(block, users, blockchain));
  for (let i = 0; i < feed.length; i++) {
    feed[i].likes = await getLikesByPreviousHash(blockchain, feed[i].previousHash);
  }
  return feed.reverse();
}

function mergeUserToBlock(block, users, blockchain) {
  for (let i = 0; i < users.length; i++) {
    if (block.sender === users[i].publicKey) {
      block.user = {
        ...users[i],
        _id: undefined,
        publicKey: undefined
      };
      if (blockchain) {
        block.user = getUserWithProfilePicture(blockchain, users[i]);
      }
      return block;
    }
  }
  return block;
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
  feed = feed.map(block => mergeUserToBlock(block, users, blockchain));
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

function getChainByTime(blockchain, hours = 2) {
  let feed = [...blockchain];
  var elem;
  let i = 0;
  for (i = feed.length - 1; i >= 0; i--) {
    if (new Date(Date.now() - new Date(feed[i].timestamp)) > 1000 * 60 * 60 * hours) break;
  }
  return feed.splice(i + 1, feed.length - i);
}

async function getFollowing(blockchain, publicKey) {
  let feed = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  feed = _.filter(feed, {
    sender: publicKey,
    type: "follow"
  });
  let publicKeys = feed.map(item => item.following);
  let users = await findUsersByPublicKey(publicKeys);
  feed = feed.map(block => mergeUserToBlock(block, users, blockchain));
  return feed;
}

async function createFollowerFeed(req, res, blockchain, following) {
  let filtered = getChainByTime(blockchain);
  filtered = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  const feedshares = getShares(blockchain, filtered);

  let followerKeys = [];
  let f;
  for (f in following) followerKeys.push(following[f].data.following);
  followerKeys.push(req.user.publicKey);

  let feed = [];
  let k;
  for (k in followerKeys) {
    let array = _.filter(filtered, { type: "content", sender: followerKeys[k] });
    let a;
    for (a in array) feed.push(array[a]);
  }

  feed.push(...feedshares);
  feed.sort(sortByTimestamp);
  feed.slice(Math.max(feed.length - 10, 1));
  let publicKeys = feed.map(item => item.sender);
  let users = await findUsersByPublicKey(publicKeys);
  feed = feed.map(block => mergeUserToBlock(block, users, blockchain));
  for (let i = 0; i < feed.length; i++) {
    feed[i].likes = await getLikesByPreviousHash(blockchain, feed[i].previousHash);
  }
  return feed.reverse();
}

function getUserWithProfilePicture(blockchain, user) {
  let feed = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  feed = _.filter(feed, {
    sender: user.publicKey,
    type: "profilePicture"
  });
  if (feed.length <= 0) return user;
  return {
    ...user,
    profilePicture: feed[feed.length - 1].data.picture
  };
}

async function getLikedContent(blockchain, user) {
  let feed = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  let likes = _.filter(feed, {
    sender: user.publicKey,
    type: "like"
  });
  let l;
  let content;
  let finalFeed = [];
  for (l in likes) {
    content = _.find(feed, {
      type: "content",
      previousHash: likes[l].data.previousHash
    });
    finalFeed.push(content);
  }
  finalFeed.sort(sortByTimestamp);
  finalFeed.slice(Math.max(feed.length - 10, 1));
  let publicKeys = finalFeed.map(item => item.sender);
  let users = await findUsersByPublicKey(publicKeys);
  finalFeed = finalFeed.map(block => mergeUserToBlock(block, users, blockchain));
  for (let i = 0; i < finalFeed.length; i++) {
    finalFeed[i].likes = await getLikesByPreviousHash(blockchain, finalFeed[i].previousHash);
  }
  return finalFeed.reverse();
}

module.exports = {
  createFeed,
  mergeUserToBlock,
  getLikesByPreviousHash,
  getContentOfUser,
  getFollower,
  getAnsehen,
  hasEnoughAnsehen,
  createFollowerFeed,
  getFollowing,
  getUserWithProfilePicture,
  getLikedContent
};
