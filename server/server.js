const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
import { Blockchain } from "../components/blockchain";
const blockchain = new Blockchain();
const exp = express();
const NodeRSA = require("node-rsa");
const rsaKeys = new NodeRSA({b: 512});


// our server instance
const server = http.createServer(exp);

// This creates our socket using the instance of the server
const io = socketIO(server);

// This is what the socket.io syntax is like, we will work this later
io.on("connection", socket => {
  console.log("User connected");
  socket.emit("blockchain", blockchain.chain);

  socket.on("get transaction code", publicKey => {
    rsaKeys.importKey(publicKey,"public");
    let encrypted = rsaKeys.encrypt("hallo test","base64");
    console.log(encrypted);
    socket.emit("solve transaction code", encrypted);
    //socket.broadcast.emit("mine", transaction);
  });

  socket.on("solved transaction code", data => {
    console.log(data);
  });

  socket.on("new block", block => {
    let test_chain = [];
    test_chain.push(...blockchain.chain);
    test_chain.push(block);
    if (blockchain.valid_chain(test_chain) === true) {
      blockchain.chain = test_chain;
      socket.broadcast.emit("get blockchain", blockchain.chain);
      socket.emit("get blockchain", blockchain.chain);
    }
  });
  socket.on("get blockchain", () => {
    socket.emit("get blockchain", blockchain.chain);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    exp.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
