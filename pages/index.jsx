import React, { Component } from 'react';
import io from "socket.io-client"
import {Blockchain} from "../components/blockchain";
import NodeRSA from "node-rsa"


const rsaKeys = new NodeRSA({b: 512});

class Index extends Component
{
    constructor(props)
    {
        super(props);
        this.blockchain = new Blockchain();
        this.actions = [];
        var text = 'Hello RSA!';
        var encrypted = rsaKeys.encrypt(text, 'base64');
        var decrypted = rsaKeys.decrypt(encrypted, 'utf8');
    }

    componentDidMount()
    {
        this.socket = io({endpoint:"http://localhost:3000"});
        this.socket.emit("init",{message:"init"})
        this.socket.on("blockchain",(data)=>
        {
            this.blockchain.chain = data;
        })

        this.socket.on("mine",transaction=>
        {
          this.actions.push({type:"mine",transaction})
          this.socket.emit("get blockchain");
        })
        this.socket.on("get blockchain", chain=>
        {
            this.blockchain.chain = chain;
            this.runAction();
        });

        this.socket.on("solve transaction code",code=>
        {
            this.secret = rsaKeys.decrypt(code,"utf8");
            this.runAction();
        });
    }

    runAction()
    {
        let action = this.actions.shift();
        if(action ===undefined)return;
        switch(action.type)
        {
            case "mine": this.socket.emit("new block",this.blockchain.mine(action.transaction));break;
            case "transaction": this.sendTransaction(action.transaction);break;
        }
    }

    sendTransaction(transaction)
    {
        transaction.secret = this.secret;
        this.socket.emit("new transaction",transaction)
    }

    newTransaction()
    {
        let transaction = this.blockchain.new_transaction("myadress","myadress",123);
        this.actions.push({type:"transaction",transaction})
        this.socket.emit("get transaction code",rsaKeys.exportKey("public"))
    }

    render()
    {
        return (<div> <button onClick={()=>this.newTransaction()}>mine!</button> <br/>halloooo </div>)
    }
}
export default (Index);