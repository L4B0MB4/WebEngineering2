import React, { Component } from "react";
import OwnHeader from "../components/HeaderUnconnected";
import { Grid, Form, Input, Button, Message, Image } from "semantic-ui-react";
import Link from "next/link";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import Request from "../components/utils/request";
import { hash } from "../components/utils/utils";
const request = new Request();

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.state = { msgtext: "" };
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
      this.blockchainWrapper.newKeys();
      this.setState({
        keys: {
          pub: this.blockchainWrapper.getPublicKey(),
          priv: this.blockchainWrapper.getPrivateKey()
        }
      });
      this.blockchainWrapper.init(this.blockchainWrapper.getPrivateKey());
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
    } else {
      this.setState({ msgtext: res.data.message });
      this.setState({ visible: true });
    }
  };

  render() {
    return (
      <div>
        <OwnHeader />
        <Grid>
          <Grid.Row>
            <Grid.Column width={5} />
            <Grid.Column width={6}>
              <Form className="-loginform">
                <Image src="/static/golddiggertext.png" alt="Avatar" className="ui centered grid -avatar" />

                <Message error visible={this.state.visible}>
                  <Message.Header>Regisrieren fehlgeschlagen!</Message.Header>
                  <p>{this.state.msgtext}</p>
                </Message>

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
                  <Input type="text" name="email" onChange={e => this.setState({ email: e.target.value })} placeholder={"E-Mail"} />
                </Form.Field>
                <Form.Field className="-login-field">
                  <label>Passwort</label>
                  <Input
                    type="password"
                    name="password"
                    onChange={e => this.setState({ password: e.target.value })}
                    placeholder={"Passwort"}
                  />
                </Form.Field>
                <input type="text" name="publicKey" hidden defaultValue={this.state.keys.pub} value={this.state.keys.pub} />
                <input type="text" hidden name="privateKey" defaultValue={this.state.keys.priv} value={this.state.keys.priv} />
                <Button className="-register-btn" onClick={this.handleRegistration}>
                  Register
                </Button>
                <span className="-log-span">
                  <Link prefetch href="/login">
                    <a>Bereits registriert? Zum Login</a>
                  </Link>
                </span>
              </Form>
            </Grid.Column>
            <Grid.Column width={5} />
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Register;
