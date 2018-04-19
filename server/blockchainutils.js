const _ = require("lodash");
const { findUsersByPublicKey, findSingleUsernameByPublicKey, printAllUsers } = require("./database");

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
    feed[i].likes = (await getTagByPreviousHash(blockchain, feed[i].previousHash, "like")).map(item => item.user);
    const comments = await getTagByPreviousHash(blockchain, feed[i].previousHash, "comment");
    for (let j = 0; j < comments.length; j++) {
      comments[j].likes = await getTagByPreviousHash(blockchain, comments.previousHash, "like");
    }
    feed[i].comments = comments;
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

async function getTagByPreviousHash(blockchain, hash, tag) {
  let filtered = blockchain.map(item => {
    return {
      ...item.transactions[0],
      previousHash: item.previousHash
    };
  });
  let arr = _.filter(filtered, {
    type: tag,
    data: { previousHash: hash }
  });
  let publicKeys = arr.map(item => item.sender);
  let users = await findUsersByPublicKey(publicKeys);
  arr = arr.map(block => {
    let b = mergeUserToBlock(block, users, blockchain);
    return {
      previousHash: b.previousHash,
      timestamp: b.timestamp,
      data: b.data,
      user: b.user
    };
  });
  return arr;
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

function sortByAnsehen(a, b) {
  if (a.ansehen < b.ansehen) {
    return 1;
  }
  if (a.ansehen > b.ansehen) {
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
    feed[i].likes = (await getTagByPreviousHash(blockchain, feed[i].previousHash, "like")).map(item => item.user);
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
  return likes.length + miningRewards.length + foreignshares.length * 10 - ownshares.length * 10;
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
    feed[i].likes = (await getTagByPreviousHash(blockchain, feed[i].previousHash, "like")).map(item => item.user);
    const comments = await getTagByPreviousHash(blockchain, feed[i].previousHash, "comment");
    for (let j = 0; j < comments.length; j++) {
      comments[j].likes = await getTagByPreviousHash(blockchain, comments[j].previousHash, "like");
    }
    feed[i].comments = comments;
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
    finalFeed[i].likes = await getTagByPreviousHash(blockchain, finalFeed[i].previousHash, "like");
  }
  return finalFeed.reverse();
}

async function getLikesByUser(blockchain, publicKey) {
  let feed = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  let posts = _.filter(feed, {
    sender: publicKey,
    type: "content"
  });
  let p;
  let likes;
  let allLikes = [];
  for (p in posts) {
    likes = _.filter(feed, {
      type: "like",
      data: { previousHash: posts[p].previousHash }
    });
    if (likes) allLikes.push(...likes);
  }
  let sortedResults = [];
  let a;
  for (a in allLikes) {
    let user = await findSingleUsernameByPublicKey(allLikes[a].sender);
    let existingUser = _.find(sortedResults, { user });
    if (!existingUser) {
      sortedResults.push({
        user,
        likes: 1
      });
    } else {
      existingUser.likes += 1;
      _.remove(sortedResults, { user: existingUser.user });
      sortedResults.push(existingUser);
    }
  }
  return sortedResults;
}

async function getFeaturedUsers(blockchain) {
  let feed = blockchain.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  let allUsers = await printAllUsers();
  let result = [];
  for (let a in allUsers) {
    result.push({
      user: {
        name: await findSingleUsernameByPublicKey(allUsers[a].publicKey),
        profilePicture: (await getUserWithProfilePicture(blockchain, { publicKey: allUsers[a].publicKey })).profilePicture
      },
      ansehen: getAnsehen(blockchain, allUsers[a].publicKey)
    });
  }

  result.sort(sortByAnsehen);
  result.slice(Math.min(result.length - 1, 12));
  return result;
}

module.exports = {
  createFeed,
  mergeUserToBlock,
  getTagByPreviousHash,
  getContentOfUser,
  getFollower,
  getAnsehen,
  hasEnoughAnsehen,
  createFollowerFeed,
  getFollowing,
  getUserWithProfilePicture,
  getLikedContent,
  getLikesByUser,
  getBlockByPreviousHash,
  getFeaturedUsers
};
