const socketIO = require("socket.io");
import * as blockchainutils from "./blockchainutils";

function startWebsockets(server, socketsConnected, blockchain, databaseutils, serverutils, rsaKeys, secret) {
  const io = socketIO(server);
  io.on("connection", socket => {
    socketsConnected++;
    socket.emit("blockchain", blockchain.chain);

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
      if ((data.type === "share" && blockchainutils.hasEnoughAnsehen(blockchain.chain, data.sender, 1)) || data.type !== "share") {
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
      }
    });
    socket.on("get blockchain", () => {
      socket.emit("get blockchain", blockchain.chain);
    });

    socket.on("disconnect", () => {
      socketsConnected--;
    });
  });
}

module.exports = { startWebsockets };
