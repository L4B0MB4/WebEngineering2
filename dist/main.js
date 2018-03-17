"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _isomorphicUnfetch = require("isomorphic-unfetch");

var _isomorphicUnfetch2 = _interopRequireDefault(_isomorphicUnfetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Blockchain = function () {
  function Blockchain() {
    _classCallCheck(this, Blockchain);

    this.current_transactions = [];
    this.chain = [];
    this.nodes = new Set();
    this.new_block(100, "1");
    console.log(this.chain);
  }

  _createClass(Blockchain, [{
    key: "register_node",
    value: function register_node(address) {
      this.nodes.add(address);
    }
  }, {
    key: "new_block",
    value: function new_block(proof, previous_hash) {
      var block = {
        index: this.chain.length,
        timestamp: new Date(Date.now()).toISOString(),
        transactions: this.current_transactions,
        proof: proof,
        previous_hash: previous_hash ? previous_hash : this.hash(this.chain[this.chain.length - 1]) // hash !
      };

      this.current_transactions = [];
      this.chain.push(block);
      return block;
    }
  }, {
    key: "new_transaction",
    value: function new_transaction(sender, recipient, amount) {
      //validate sender && recipient
      this.current_transactions.push({
        sender: sender,
        recipient: recipient,
        amount: amount
      });
      return this.chain[this.chain.length - 1].index + 1;
    }
  }, {
    key: "proof_of_work",
    value: function proof_of_work(last_block) {
      var last_proof = last_block.proof;
      var last_hash = this.hash(JSON.stringify(last_block));

      var proof = 0;
      while (this.valid_proof(last_proof, proof, last_hash) !== true) {
        proof++;
      }return proof;
    }
  }, {
    key: "hash",
    value: function hash(block) {
      return _crypto2.default.createHash("sha256").update(block).digest("hex");
    }
  }, {
    key: "valid_proof",
    value: function valid_proof(last_proof, proof, last_hash) {
      var guess = "" + last_proof + proof + last_hash;
      var guess_hash = this.hash(guess);
      return guess_hash.startsWith("0000");
    }
  }, {
    key: "valid_chain",
    value: function valid_chain(chain) {
      if (chain.length <= 0) return false;
      var last_block = chain[0];
      var current_index = 1;

      while (current_index < chain.length) {
        var block = chain[current_index];
        if (block.previous_hash !== this.hash(JSON.stringify(last_block))) {
          return false;
        }

        if (!this.valid_proof(last_block.proof, block.proof, this.hash(JSON.stringify(last_block)))) {
          return false;
        }

        last_block = block;
        current_index++;
      }

      return true;
    }
  }, {
    key: "resolve_conflicts",
    value: async function resolve_conflicts() {
      var neighbours = [].concat(_toConsumableArray(this.nodes));
      var new_chain = undefined;
      var config = {
        method: "GET",
        headers: {
          "content-type": "application/json"
        }
      };
      var max_length = this.chain.length;
      for (var i = 0; i < neighbours.length; i++) {
        var node = neighbours[i];
        var res = await (0, _isomorphicUnfetch2.default)(node + "/chain", config);
        var node_chain = await res.json();
        if (node_chain.length > max_length && this.valid_chain(node_chain)) {
          max_length = node_chain.length;
          new_chain = node_chain;
        }
      }
      if (new_chain !== undefined) {
        this.chain = new_chain;
        return true;
      }
      return false;
    }
  }]);

  return Blockchain;
}();

var app = (0, _express2.default)();
app.use(_bodyParser2.default.json()); // to support JSON-encoded bodies
app.use(_bodyParser2.default.urlencoded({
  // to support URL-encoded bodies
  extended: true
}));
var blockchain = new Blockchain();
var node_identifier = "43b2b584-507d-4292-a773-71bab1cc1116";

app.get("/mine", async function (req, res) {
  await blockchain.resolve_conflicts();
  var last_block = blockchain.chain[blockchain.chain.length - 1];
  var proof = blockchain.proof_of_work(last_block);
  blockchain.new_transaction(0, node_identifier, 1);
  var previous_hash = blockchain.hash(JSON.stringify(last_block));
  var block = blockchain.new_block(proof, previous_hash);
  res.json(block);
});

app.get("/chain", function (req, res) {
  res.json(blockchain.chain);
});

app.post("/transactions/new", function (req, res) {
  var transaction = req.body;
  if (!(transaction.sender && transaction.recipient && transaction.amount)) return res.json({ message: " Values are missing! " });

  var index = blockchain.new_transaction(transaction.sender, transaction.recipient, transaction.amount);

  res.json({ message: "Transaction will be added to block " + index });
});

app.post("/nodes/register", function (req, res) {
  var node = req.body.node;
  if (!node) return res.json({ message: "You have to pass a node url" });
  blockchain.register_node(node);
  return res.json({ message: "Node added", nodes: blockchain.nodes });
});

app.get("/nodes/resolve", async function (req, res) {
  var replaced = await blockchain.resolve_conflicts();
  return res.json({ replaced: replaced });
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(8080, function () {
  return console.log("Magic is happening on on port 8080!");
});