import React, { Component } from "react";
import { Button, Checkbox, Form, TextArea } from "semantic-ui-react";

export default class ContentForm extends Component {
  render() {
    return (
      <Form>
        <Form.Field>
          <label>Post something!</label>
          <TextArea
            placeholder="Content"
            onChange={(e) => this.setState({ content: e.target.value })}
          />
        </Form.Field>
        <Button
          type="submit"
          onClick={()=>this.props.blockchainWrapper.newTransaction(this.state.content)}
        >
          Post
        </Button>
      </Form>
    );
  }
}
