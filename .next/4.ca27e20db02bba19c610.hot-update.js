webpackHotUpdate(4,{

/***/ "./components/blockchain.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Blockchain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = __webpack_require__("./node_modules/crypto-browserify/index.js");

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = __webpack_require__("./node_modules/react-hot-loader/patch.js").enterModule;

  enterModule && enterModule(module);
})();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Blockchain = exports.Blockchain = function () {
  function Blockchain() {
    _classCallCheck(this, Blockchain);

    this.current_transactions = [];
    this.chain = [];
    this.nodes = new Set();
    this.new_block(100, "1");
    this.public_id = Math.abs(Math.random() * 10000);
  }

  _createClass(Blockchain, [{
    key: "mine",
    value: function mine(transaction) {
      var _current_transactions;

      var last_block = this.chain[this.chain.length - 1];
      var proof = this.proof_of_work(last_block);
      var reward = this.new_transaction(0, this.public_id, 1);
      (_current_transactions = this.current_transactions).push.apply(_current_transactions, [transaction, reward]);
      var previous_hash = this.hash(JSON.stringify(last_block));
      var block = this.new_block(proof, previous_hash);
      return block;
    }
  }, {
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
        previous_hash: previous_hash ? previous_hash : this.hash(this.chain[this.chain.length - 1])
      };

      this.current_transactions = [];
      this.chain.push(block);
      return block;
    }
  }, {
    key: "new_transaction",
    value: function new_transaction(sender, recipient, amount) {
      var transaction = { sender: sender, recipient: recipient, amount: amount };
      return transaction;
    }
  }, {
    key: "proof_of_work",
    value: function proof_of_work(last_block) {
      var last_proof = last_block.proof;
      var last_hash = this.hash(JSON.stringify(last_block));

      var proof = 0;
      while (this.valid_proof(last_proof, proof, last_hash) !== true) {
        proof += parseInt(Math.random() * 10 + 1);
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
      console.log("chain length: " + chain.length);
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
        var res = await fetch(node + "/chain", config);
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
  }, {
    key: "__reactstandin__regenerateByEval",
    value: function __reactstandin__regenerateByEval(key, code) {
      this[key] = eval(code);
    }
  }]);

  return Blockchain;
}();

;

(function () {
  var reactHotLoader = __webpack_require__("./node_modules/react-hot-loader/patch.js").default;

  var leaveModule = __webpack_require__("./node_modules/react-hot-loader/patch.js").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Blockchain, "Blockchain", "C:/Users/Lars/Documents/Software Projects/webengineering2/components/blockchain.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/module.js")(module)))

/***/ })

})
//# sourceMappingURL=4.ca27e20db02bba19c610.hot-update.js.map