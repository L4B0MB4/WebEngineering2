const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
import { Blockchain } from "../components/blockchain";
const blockchain = new Blockchain();
const exp = express();
const NodeRSA = require("node-rsa");
const rsaKeys = new NodeRSA({ b: 512 });

const secrect = {
  value: Math.random()
};

function setCurrentSecret() {
  secrect.value = Math.random();
}

setInterval(setCurrentSecret, 5000);

const server = http.createServer(exp);

const io = socketIO(server);

io.on("connection", socket => {
  console.log("User connected");
  socket.emit("blockchain", blockchain.chain);

  socket.on("get transaction code", publicKey => {
    rsaKeys.importKey(publicKey, "public");
    let encrypted = rsaKeys.encrypt(secrect.value, "base64");
    console.log(encrypted);
    socket.emit("solve transaction code", encrypted);
  });

  socket.on("new transaction", data => {
    const transaction = {
      sender:data.sender,
      recipient:data.recipient,
      value:data.value 
    };
    socket.broadcast.emit("mine", transaction);
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

app.prepare()
  .then(() => {
    exp.get("/", (req, res) => {
      const query = {
        test:"hallo"
      };
      return app.render(req, res, '/index', query);
    });
    
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
