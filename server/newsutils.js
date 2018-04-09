const _ = require("lodash");
import * as blockchainutils from "./blockchainutils";
import * as databaseutils from "./database";

export async function handleNews(blockchain, sockets, block) {
  let transaction = block.transactions[0];
  let news = undefined;
  switch (transaction.type) {
    case "like":
      news = await createLikeNews(blockchain, transaction);
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

async function createLikeNews(blockchain, transaction) {
  let sender = transaction.sender;
  let receiver = blockchainutils.getBlockByPreviousHash(blockchain, transaction.data.previousHash).sender;
  sender = await databaseutils.findSingleUsernameByPublicKey(sender);
  return {
    sender,
    receiver,
    type: "like"
  };
}
