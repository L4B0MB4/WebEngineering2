import React, { Component } from "react";
import Layout from "../components/layout.jsx";
import { Form, Input, Button } from "semantic-ui-react";

class Register extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Form action={"/api/user/register"} method={"POST"}>
            <Form.Field>
              <label htmlFor={"name"}>Name: </label>
              <Input type="text" name="name" id={"name"} placeholder={"Name"} />
            </Form.Field>
            <Form.Field>
              <label htmlFor={"email"}>Email: </label>
              <Input
                type="text"
                name="email"
                placeholder={"E-Mail"}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor={"password"}>Passwort: </label>
              <Input
                type="text"
                name="password"x
                placeholder={"Passwort"}
              />
            </Form.Field>

            <Button type="submit">Register</Button>
          </Form>
        </Layout>
      </div>
    );
  }
}

export default Register;
