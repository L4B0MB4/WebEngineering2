const socketIO = require("socket.io");
const _ = require("lodash");
import * as blockchainutils from "./blockchainutils";
import * as newsutils from "./newsutils";

function startWebsockets(server, socketsConnected, blockchain, databaseutils, serverutils, rsaKeys, secret, sockets) {
  const io = socketIO(server);
  io.on("connection", socket => {
    socketsConnected++;
    socket.emit("blockchain", blockchain.chain);

    socket.on("init", data => {
      sockets[data.publicKey] = socket;
    });

    socket.on("get transaction code", publicKey => {
      rsaKeys.importKey(publicKey, "public");
      let encrypted = rsaKeys.encrypt(secret.value, "base64");
      socket.emit("solve transaction code", encrypted);
    });

    socket.on("new transaction", async data => {
      const transaction = {
        sender: data.sender,
        type: data.type,
        data: data.data,
        timestamp: data.timestamp
      };
      if (data.type === "share" && transaction.data.previousHash) {
        let block = blockchainutils.getBlockByPreviousHash(blockchain.chain, transaction.data.previousHash);
        if (blockchainutils.hasEnoughAnsehen(blockchain.chain, data.sender, 10)) {
          serverutils.broadcastOrEmit(socket, "mine", transaction, socketsConnected);
        }
      } else if (data.type !== "share") {
        serverutils.broadcastOrEmit(socket, "mine", transaction, socketsConnected);
      }
    });

    socket.on("new block", async block => {
      let test_chain = [];
      test_chain.push(...blockchain.chain);
      test_chain.push(block);
      if (blockchain.valid_chain(test_chain) === true) {
        blockchain.chain = test_chain;
        socket.broadcast.emit("get blockchain", blockchain.chain);
        socket.emit("get blockchain", blockchain.chain);
        await databaseutils.saveBlockchain(blockchain.chain);
        newsutils.handleNews(blockchain.chain, sockets, block);
      }
    });
    socket.on("get blockchain", () => {
      socket.emit("get blockchain", blockchain.chain);
    });

    socket.on("disconnect", () => {
      _.remove(sockets, socket);
      socketsConnected--;
    });
  });
}

module.exports = { startWebsockets };
