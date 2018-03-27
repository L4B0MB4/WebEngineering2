import React, { Component } from "react";
import { Blockchain } from "./blockchain";
import io from "socket.io-client";
import NodeRSA from "node-rsa";
import _ from "lodash";

const blockchain = new Blockchain();
const rsaKeys = new NodeRSA({ b: 512 });

export default class BlockchainWrapper {
  constructor() {
    this.blockchain = blockchain;
    this.actions = [];
    this.blockchain.public_adress = rsaKeys.exportKey("public");
    this.blockchain.private_adress = rsaKeys.exportKey("private");
    this.waitForTransaction = [];
  }

  newKeys = () => {
    rsaKeys.generateKeyPair(512);
    this.blockchain.public_adress = rsaKeys.exportKey("public");
    this.blockchain.private_adress = rsaKeys.exportKey("private");
  };

  getPublicKey = () => {
    return this.blockchain.public_adress;
  };

  getPrivateKey = () => {
    return this.blockchain.private_adress;
  };

  init(priv, onUpdate) {
    rsaKeys.importKey(priv);
    this.blockchain.public_adress = rsaKeys.exportKey("public");
    this.blockchain.private_adress = rsaKeys.exportKey("private");
    this.socket = io({ endpoint: "http://localhost:3000" });
    this.socket.emit("init", { message: "init" });
    this.socket.on("blockchain", data => {
      this.blockchain.chain = data;
    });

    this.socket.on("mine", transaction => {
      this.actions.push({ type: "mine", transaction });
      this.socket.emit("get blockchain");
    });
    this.socket.on("get blockchain", chain => {
      this.blockchain.chain = chain;
      this.runAction();
      console.log("get blockchain");
      console.log(chain);
      if (onUpdate) onUpdate();
      this.handleWaitingTransactions();
    });

    this.socket.on("solve transaction code", code => {
      this.secret = rsaKeys.decrypt(code);
      this.runAction();
    });
  }

  addToWatignTransactions(transaction) {
    this.waitForTransaction.push(transaction);
  }

  isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    return true;
  }

  handleWaitingTransactions() {
    let handled = [];
    for (let i = 0; i < this.waitForTransaction.length; i++) {
      let tr = this.waitForTransaction[i].transaction;
      let callback = this.waitForTransaction[i].callback;
      for (let j = this.blockchain.chain.length - 1; j >= 0; j--) {
        let chaintr = this.blockchain.chain[j].transactions[0];
        if (
          tr &&
          chaintr &&
          tr.recipient == chaintr.recipient &&
          tr.sender == chaintr.sender &&
          this.isEquivalent(tr.value, chaintr.value)
        ) {
          handled.push(this.waitForTransaction[i]);
          if (callback) callback();
          break;
        }
      }
    }
    this.waitForTransaction = this.waitForTransaction.filter(function(el) {
      let x = _.find(handled, el);
      if (x) return false;
      return true;
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
        this.addToWatignTransactions(action);
        break;
    }
  }

  sendTransaction(transaction) {
    transaction.secret = this.secret;
    this.socket.emit("new transaction", transaction);
  }

  newTransaction(type, data, callback) {
    let transaction = this.blockchain.create_transaction(
      this.blockchain.public_adress,
      this.blockchain.public_adress,
      type,
      data
    );
    this.actions.push({ type: "transaction", transaction, callback });
    this.socket.emit("get transaction code", rsaKeys.exportKey("public"));
  }

  alreadyLiked(previousHash, userKey) {
    for (let i = 0; i < this.blockchain.chain.length; i++) {
      let block = this.blockchain.chain[i];
      if (block.transactions.length > 0) {
        let tr = block.transactions[0].value;
        if (
          tr.type === "like" &&
          tr.data.previousHash === previousHash &&
          tr.data.userKey === userKey &&
          block.transactions[0].sender === this.blockchain.public_adress
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
