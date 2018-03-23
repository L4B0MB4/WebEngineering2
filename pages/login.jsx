import React, { Component } from "react";
import Layout from "../components/layout.jsx";
import { Form, Input, Button } from "semantic-ui-react";

class Login extends Component {
  render() {
    return (
        <Layout>
          <Form action={"/api/user/login"} method={"POST"}>
            <Form.Field>
              <label htmlFor={"name"}>Name: </label>
              <Input type="text" name="username"placeholder={"Username"} />
            </Form.Field>
            <Form.Field>
              <label htmlFor={"password"}>Passwort: </label>
              <Input type="text" name="password"  placeholder={"Passwort"} />
            </Form.Field>

            <Button type="submit">LogIn</Button>
          </Form>
        </Layout>
    );
  }
}

export default Login;
