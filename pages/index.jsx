import React, { Component } from "react";
import io from "socket.io-client";
import withRedux from "next-redux-wrapper";
import NodeRSA from "node-rsa";
import { bindActionCreators } from 'redux';
import { Blockchain } from "../components/blockchain";
import {receiveInfo} from  "../components/redux/actions/commonActions"
import initStore from "../components/redux/store";

const rsaKeys = new NodeRSA({ b: 512 });

class Index extends Component {
  static getInitialProps({ store, query, req }) {
    if (req) {
        store.dispatch(receiveInfo(query));
    } else {
    }
  }

  constructor(props) {
    super(props);
    this.blockchain = new Blockchain();
    this.actions = [];
    this.blockchain.public_adress = rsaKeys.exportKey("public");
  }

  componentDidMount() {
    this.socket = io({ endpoint: "http://localhost:3000" });
    this.socket.emit("init", { message: "init" });
    this.socket.on("blockchain", data => {
      console.log(data);
      this.blockchain.chain = data;
    });

    this.socket.on("mine", transaction => {
      this.actions.push({ type: "mine", transaction });
      this.socket.emit("get blockchain");
    });
    this.socket.on("get blockchain", chain => {
      this.blockchain.chain = chain;
      console.log(chain);
      this.runAction();
    });

    this.socket.on("solve transaction code", code => {
      this.secret = rsaKeys.decrypt(code);
      this.runAction();
    });
  }

  runAction() {
    let action = this.actions.shift();
    if (action === undefined) return;
    switch (action.type) {
      case "mine":
        this.socket.emit("new block", this.blockchain.mine(action.transaction));
        break;
      case "transaction":
        this.sendTransaction(action.transaction);
        break;
    }
  }

  sendTransaction(transaction) {
    transaction.secret = this.secret;
    this.socket.emit("new transaction", transaction);
  }

  newTransaction(data) {
    let transaction = this.blockchain.create_transaction(
      this.blockchain.public_adress,
      this.blockchain.public_adress,
      "content",
      data
    );
    this.actions.push({ type: "transaction", transaction });
    this.socket.emit("get transaction code", rsaKeys.exportKey("public"));
  }

  render() {
    return (
      <div>
        <textarea onChange={(e)=>{this.setState({content:e.target.value})}}></textarea>
        <button onClick={() => this.newTransaction(this.state.content)}>mine!</button>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  receiveInfo: bindActionCreators(receiveInfo, dispatch),
});

const mapStateToProps = state => ({
    info: state.commonReducer.info.payload,
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index);
