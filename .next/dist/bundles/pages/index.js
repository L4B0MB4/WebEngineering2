module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./components/blockchain.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Blockchain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = __webpack_require__("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  }]);

  return Blockchain;
}();

/***/ }),

/***/ "./pages/index.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("react");

var _react2 = _interopRequireDefault(_react);

var _socket = __webpack_require__("socket.io-client");

var _socket2 = _interopRequireDefault(_socket);

var _blockchain = __webpack_require__("./components/blockchain.js");

var _nodeRsa = __webpack_require__("node-rsa");

var _nodeRsa2 = _interopRequireDefault(_nodeRsa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rsaKeys = new _nodeRsa2.default({ b: 512 });

var Index = function (_Component) {
    _inherits(Index, _Component);

    function Index(props) {
        _classCallCheck(this, Index);

        var _this = _possibleConstructorReturn(this, (Index.__proto__ || Object.getPrototypeOf(Index)).call(this, props));

        _this.blockchain = new _blockchain.Blockchain();
        _this.actions = [];
        var text = 'Hello RSA!';
        var encrypted = rsaKeys.encrypt(text, 'base64');
        var decrypted = rsaKeys.decrypt(encrypted, 'utf8');
        return _this;
    }

    _createClass(Index, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            this.socket = (0, _socket2.default)({ endpoint: "http://localhost:3000" });
            this.socket.emit("init", { message: "init" });
            this.socket.on("blockchain", function (data) {
                _this2.blockchain.chain = data;
            });

            this.socket.on("mine", function (transaction) {
                _this2.actions.push({ type: "mine", transaction: transaction });
                _this2.socket.emit("get blockchain");
            });
            this.socket.on("get blockchain", function (chain) {
                _this2.blockchain.chain = chain;
                _this2.runAction();
            });

            this.socket.on("solve transaction code", function (code) {
                //decrypted
                console.log(rsaKeys.decrypt(code, "utf8"));
            });

            this.socket.emit("get transaction code", rsaKeys.exportKey("public"));
        }
    }, {
        key: "runAction",
        value: function runAction() {
            var action = this.actions.shift();
            if (action === undefined) return;
            switch (action.type) {
                case "mine":
                    this.socket.emit("new block", this.blockchain.mine(action.transaction));break;
            }
        }
    }, {
        key: "newTransaction",
        value: function newTransaction() {
            var transaction = this.blockchain.new_transaction("myadress", "myadress", 123);
            this.socket.emit("new transaction", transaction);
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                "div",
                null,
                " ",
                _react2.default.createElement(
                    "button",
                    { onClick: function onClick() {
                            return _this3.newTransaction();
                        } },
                    "mine!"
                ),
                " ",
                _react2.default.createElement("br", null),
                "halloooo "
            );
        }
    }]);

    return Index;
}(_react.Component);

exports.default = Index;

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./pages/index.jsx");


/***/ }),

/***/ "crypto":
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "node-rsa":
/***/ (function(module, exports) {

module.exports = require("node-rsa");

/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "socket.io-client":
/***/ (function(module, exports) {

module.exports = require("socket.io-client");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map