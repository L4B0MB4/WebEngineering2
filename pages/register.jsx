import React, { Component } from "react";
import Layout from "../components/layout.jsx";
import { Form, Input, Button, TextArea } from "semantic-ui-react";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import Request from "../components/utils/request";
import {hash} from "../components/utils/utils"
const request = new Request();

class Register extends Component {
  constructor(props) {
    super(props);
    this.blockchainWrapper = new BlockchainWrapper();
    this.hasInit = false;
    this.state = {
      keys: {
        pub: this.blockchainWrapper.getPublicKey(),
        priv: this.blockchainWrapper.getPrivateKey()
      }
    };
  }
  componentDidMount() {
    if (!this.hasInit) {
      this.blockchainWrapper.init(this.state.keys.priv);
      this.hasInit = true;
    }
  }

  handleRegistration = async () => {
    let user = {
      password: this.state.password,
      name: this.state.name,
      email: this.state.email,
      publicKey: this.state.keys.pub,
      privateKey: this.state.keys.priv
    };
    let res = await request.callRegistration(user);
    if (res.data.type === "success") {
      window.location.replace("/");
    }
  };

  render() {
    return (
      <div>
        <Layout>
          <Form>
            <Form.Field>
              <label>Username: </label>
              <Input
                type="text"
                name="name"
                id={"name"}
                onChange={e => this.setState({ name: e.target.value })}
                placeholder={"Username"}
              />
            </Form.Field>
            <Form.Field>
              <label>Email: </label>
              <Input
                type="text"
                name="email"
                onChange={e => this.setState({ email: e.target.value })}
                placeholder={"E-Mail"}
              />
            </Form.Field>
            <Form.Field>
              <label>Passwort: </label>
              <Input
                type="text"
                name="password"
                onChange={e => this.setState({ password: e.target.value })}
                placeholder={"E-Mail"}
              />
            </Form.Field>
            <input
              type="text"
              hidden
              name="publicKey"
              value={this.state.keys.pub}
            />
            <input
              type="text"
              hidden
              name="privateKey"
              value={this.state.keys.priv}
            />
            <Button onClick={this.handleRegistration}>Register</Button>
          </Form>
        </Layout>
      </div>
    );
  }
}

export default Register;
