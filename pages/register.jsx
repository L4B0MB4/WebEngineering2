import React, { Component } from "react";
import Layout from "../components/layout.jsx";
import { Form, Input, Button, TextArea } from "semantic-ui-react";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import { hash } from "../components/utils/utils";

class Register extends Component {
  constructor(props) {
    super(props);
    this.blockchainWrapper = new BlockchainWrapper();
    this.hasInit = false;
    this.state = {
      keys: {
        pub: this.blockchainWrapper.getPublicKey(),
        priv: this.blockchainWrapper.getPrivateKey(),
        privateKeyHash: hash(this.blockchainWrapper.getPrivateKey())
      }
    };
  }
  componentDidMount() {
    if (!this.hasInit) {
      this.blockchainWrapper.init(this.state.keys.priv);
      this.hasInit = true;
    }
  }

  render() {
    return (
      <div>
        <Layout>
          <Form action={"/api/user/register"} method={"POST"}>
            <Form.Field>
              <label>Name: </label>
              <Input type="text" name="name" id={"name"} placeholder={"Name"} />
            </Form.Field>
            <Form.Field>
              <label>Email: </label>
              <Input type="text" name="email" placeholder={"E-Mail"} />
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
              name="privateKeyHash"
              value={this.state.keys.privateKeyHash}
            />
            <Form.Field>
              <label>Dein privater Schlüssel | Passwort ! </label>
              <TextArea rows={8} type="text" value={this.state.keys.priv} />
            </Form.Field>
            <Button type="submit">Register</Button>
          </Form>
        </Layout>
      </div>
    );
  }
}

export default Register;
