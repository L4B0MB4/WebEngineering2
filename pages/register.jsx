import React, { Component } from "react";
import OwnHeader from "../components/Header.jsx";
import { Grid, Form, Input, Button, TextArea, Image } from "semantic-ui-react";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import Request from "../components/utils/request";
import { hash } from "../components/utils/utils";
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
      password: hash(this.state.password),
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
            <OwnHeader/>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={5} />
                    <Grid.Column width={6}>
                        <Form className="-loginform">

                            <Image src="/static/golddiggertext.png" alt="Avatar" className="-avatar"/>

                            <Form.Field className="-login-field">
                                <label>Username</label>
                                <Input
                                    type="text"
                                    name="name"
                                    id={"name"}
                                    onChange={e => this.setState({ name: e.target.value })}
                                    placeholder={"Username"}
                                />
                            </Form.Field>
                            <Form.Field className="-login-field">
                                <label>E-Mail-Adresse</label>
                                <Input
                                    type="text"
                                    name="email"
                                    onChange={e => this.setState({ email: e.target.value })}
                                    placeholder={"E-Mail"}
                                />
                            </Form.Field>
                            <Form.Field className="-login-field">
                                <label>Passwort</label>
                                <Input
                                    type="text"
                                    name="password"
                                    onChange={e => this.setState({ password: e.target.value })}
                                    placeholder={"Passwort"}
                                />
                            </Form.Field>
                            <input
                                type="text"
                                hidden
                                name="publicKey"
                                defaultValue={this.state.keys.pub}
                            />
                            <input
                                type="text"
                                hidden
                                name="privateKey"
                                defaultValue={this.state.keys.priv}
                            />
                            <Button className="-login-btn" onClick={this.handleRegistration}>Register</Button>
                        </Form>
                    </Grid.Column>
                    <Grid.Column  width={5}/>
                </Grid.Row>
            </Grid>
        </div>
    );
  }
}

export default Register;
