const _ = require("lodash");
import * as blockchainutils from "./blockchainutils";
import * as databaseutils from "./database";

export async function handleNews(blockchain, sockets, block) {
  let transaction = block.transactions[0];
  let news = undefined;
  switch (transaction.type) {
    case "like":
      news = await creatLikeOrShareNews(blockchain, transaction, "like");
      sendNews(news, sockets);
      break;
    case "share":
      news = await creatLikeOrShareNews(blockchain, transaction, "share");
      sendNews(news, sockets);
      break;
    case "follow":
      news = await creatFollowNews(blockchain, transaction);
      sendNews(news, sockets);
      break;
  }
}

function sendNews(news, sockets) {
  if (news && sockets[news.receiver]) {
    sockets[news.receiver].emit("news", news);
  } else {
    //saving news i guess?
  }
}
async function creatLikeOrShareNews(blockchain, transaction, type) {
  let sender = transaction.sender;
  let receiver = blockchainutils.getBlockByPreviousHash(blockchain, transaction.data.previousHash).sender;
  const user = {
    profilePicture: (await blockchainutils.getUserWithProfilePicture(blockchain, { publicKey: sender })).profilePicture,
    name: await databaseutils.findSingleUsernameByPublicKey(sender)
  };
  return {
    user,
    receiver,
    type,
    timestamp: transaction.timestamp
  };
}

async function creatFollowNews(blockchain, transaction) {
  let receiver = transaction.data.following;
  const user = {
    profilePicture: (await blockchainutils.getUserWithProfilePicture(blockchain, { publicKey: transaction.sender })).profilePicture,
    name: await databaseutils.findSingleUsernameByPublicKey(transaction.sender)
  };
  return {
    user,
    receiver,
    type: "follow",
    timestamp: transaction.timestamp
  };
}
