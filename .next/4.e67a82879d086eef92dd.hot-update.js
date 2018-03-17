webpackHotUpdate(4,{

/***/ "./pages/index.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _socket = __webpack_require__("./node_modules/socket.io-client/lib/index.js");

var _socket2 = _interopRequireDefault(_socket);

var _blockchain = __webpack_require__("./components/blockchain.js");

var _nodeRsa = __webpack_require__("./node_modules/node-rsa/src/NodeRSA.js");

var _nodeRsa2 = _interopRequireDefault(_nodeRsa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = __webpack_require__("./node_modules/react-hot-loader/patch.js").enterModule;

    enterModule && enterModule(module);
})();

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
                console.log(chain);
                _this2.runAction();
            });

            this.socket.on("solve transaction code", function (code) {
                _this2.secret = rsaKeys.decrypt(code, "utf8");
                _this2.runAction();
            });
        }
    }, {
        key: "runAction",
        value: function runAction() {
            var action = this.actions.shift();
            if (action === undefined) return;
            switch (action.type) {
                case "mine":
                    this.socket.emit("new block", this.blockchain.mine(action.transaction));break;
                case "transaction":
                    this.sendTransaction(action.transaction);break;
            }
        }
    }, {
        key: "sendTransaction",
        value: function sendTransaction(transaction) {
            transaction.secret = this.secret;
            this.socket.emit("new transaction", transaction);
        }
    }, {
        key: "newTransaction",
        value: function newTransaction() {
            var transaction = this.blockchain.new_transaction("myadress", "myadress", 123);
            this.actions.push({ type: "transaction", transaction: transaction });
            this.socket.emit("get transaction code", rsaKeys.exportKey("public"));
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
    }, {
        key: "__reactstandin__regenerateByEval",
        value: function __reactstandin__regenerateByEval(key, code) {
            this[key] = eval(code);
        }
    }]);

    return Index;
}(_react.Component);

var _default = Index;
exports.default = _default;
;

(function () {
    var reactHotLoader = __webpack_require__("./node_modules/react-hot-loader/patch.js").default;

    var leaveModule = __webpack_require__("./node_modules/react-hot-loader/patch.js").leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(rsaKeys, "rsaKeys", "C:/Users/Lars/Documents/Software Projects/WebEngineering2/pages/index.jsx");
    reactHotLoader.register(Index, "Index", "C:/Users/Lars/Documents/Software Projects/WebEngineering2/pages/index.jsx");
    reactHotLoader.register(_default, "default", "C:/Users/Lars/Documents/Software Projects/WebEngineering2/pages/index.jsx");
    leaveModule(module);
})();

;
    (function (Component, route) {
      if(!Component) return
      if (false) return
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/index.jsx")
  
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/module.js")(module)))

/***/ })

})
//# sourceMappingURL=4.e67a82879d086eef92dd.hot-update.js.map