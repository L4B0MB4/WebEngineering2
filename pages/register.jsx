import React, { Component, Fragment } from "react";
import OwnHeader from "../components/HeaderUnconnected";
import { Grid, Form, Input, Button, Message, Image } from "semantic-ui-react";
import Link from "next/link";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import Request from "../components/utils/request";
import Lux from "../components/Lux";
import { hash } from "../components/utils/utils";
const request = new Request();

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { visibleError: false, visibleInfo: false };
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
    } else if (res.data.type === "info") {
      this.setState({ msgtext: res.data.message });
      this.setState({ visibleInfo: true });
    } else {
      this.setState({ msgtext: res.data.message });
      this.setState({ visibleError: true });
    }
  };

  render() {
    return (
      <Fragment>
        <OwnHeader />
        <Grid>
          <Grid.Row only="mobile">
            <Form className="-loginform">
              <Image src="/static/golddiggertext.png" alt="Avatar" className="ui centered grid -avatar" />

              <Message error visible={this.state.visible}>
                <Message.Header>Register failed!</Message.Header>
                <p>{this.state.msgtext}</p>
              </Message>

              <Form.Field className="-login-field">
                <label>Username</label>
                <Input
                  required
                  type="text"
                  name="name"
                  id={"name"}
                  onChange={e => this.setState({ name: e.target.value })}
                  placeholder={"Username"}
                />
              </Form.Field>
              <Form.Field className="-login-field">
                <label>E-Mail-Address</label>
                <Input type="email" required name="email" onChange={e => this.setState({ email: e.target.value })} placeholder={"E-Mail"} />
              </Form.Field>
              <Form.Field className="-login-field">
                <label>Password</label>
                <Input
                  required
                  type="password"
                  name="password"
                  onChange={e => this.setState({ password: e.target.value })}
                  placeholder={"Password"}
                />
              </Form.Field>
              <input type="text" hidden name="publicKey" defaultValue={this.state.keys.pub} value={this.state.keys.pub} />
              <input type="text" hidden name="privateKey" defaultValue={this.state.keys.priv} value={this.state.keys.priv} />
              <Button className="-register-btn" onClick={this.handleRegistration}>
                Register
              </Button>
              <span className="-log-span">
                <Link prefetch href="/login">
                  <a>Already registered? To Login</a>
                </Link>
              </span>
            </Form>
          </Grid.Row>
          <Grid.Row only="computer tablet">
            <Grid.Column width={5} />
            <Grid.Column width={6}>
              <Form className="-loginform">
                <Image src="/static/golddiggertext.png" alt="Avatar" className="ui centered grid -avatar" />

                <Message error visible={this.state.visibleError}>
                  <Message.Header>Register failed!</Message.Header>
                  <p>{this.state.msgtext}</p>
                </Message>

                <Message info style={{ display: this.state.visibleInfo ? "" : "none" }}>
                  <Message.Header>Info!</Message.Header>
                  <p>{this.state.msgtext}</p>
                </Message>

                <Form.Field className="-login-field">
                  <label>Username</label>
                  <Input
                    required
                    type="text"
                    name="name"
                    id={"name"}
                    onChange={e => this.setState({ name: e.target.value })}
                    placeholder={"Username"}
                  />
                </Form.Field>
                <Form.Field className="-login-field">
                  <label>E-Mail-Address</label>
                  <Input
                    required
                    type="email"
                    name="email"
                    pattern={"[a-zA-Z0-9!#$%&'*+\\/=?^_`{|}~.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*"}
                    onChange={e => this.setState({ email: e.target.value })}
                    placeholder={"E-Mail"}
                  />
                </Form.Field>
                <Form.Field className="-login-field">
                  <label>Password</label>
                  <Input
                    required
                    type="password"
                    name="password"
                    onChange={e => this.setState({ password: e.target.value })}
                    placeholder={"Password"}
                  />
                </Form.Field>
                <input type="text" name="publicKey" hidden defaultValue={this.state.keys.pub} value={this.state.keys.pub} readOnly={true} />
                <input
                  type="text"
                  hidden
                  name="privateKey"
                  defaultValue={this.state.keys.priv}
                  value={this.state.keys.priv}
                  readOnly={true}
                />
                <Button className="-register-btn" onClick={this.handleRegistration}>
                  Register
                </Button>
                <span className="-log-span">
                  <Link prefetch href="/login">
                    <a>Already registered? To Login</a>
                  </Link>
                </span>
              </Form>
            </Grid.Column>
            <Grid.Column width={5} />
          </Grid.Row>
        </Grid>
      </Fragment>
    );
  }
}

export default Register;
