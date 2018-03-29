const _ = require("lodash");
const { findUsersByPublicKey } = require("./database");

async function createFeed(req, res, blockchain) {
  let feed = getChainByTime(blockchain);
  feed = feed.map(item => {
    return { ...item.transactions[0], previousHash: item.previousHash };
  });
  feed = _.filter(feed, { value: { type: "content" } });
  feed = feed.map(item => {
    let x = { ...item.value, recipient: item.recipient, previousHash: item.previousHash };
    return x;
  });
  feed.slice(Math.max(feed.length - 10, 1));

  let publicKeys = feed.map(item => item.recipient);
  let users = await findUsersByPublicKey(publicKeys);
  feed = feed.map(block => mergeUserToBlock(block, users));

  return feed.reverse();
}

function mergeUserToBlock(block, users) {
  for (let i = 0; i < users.length; i++) {
    if (block.recipient === users[i].publicKey) {
      block.user = users[i];
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
    res.json({
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

function getChainByTime(blockchain, hours = 2) {
  let feed = [...blockchain];
  var elem;
  let i = 0;
  for (i = feed.length - 1; i >= 0; i--) {
    console.log(new Date(Date.now()));
    console.log(new Date(Date.now() - new Date(feed[i].timestamp)) > 1000 * 60 * 60 * hours);
    if (new Date(Date.now() - new Date(feed[i].timestamp)) > 1000 * 60 * 60 * hours) break;
  }
  return feed.splice(i + 1, feed.length - i);
}

module.exports = {
  createFeed,
  handleLogin,
  mergeUserToBlock,
  broadcastOrEmit
};
