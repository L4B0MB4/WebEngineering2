import React, { Component } from "react";
import { Button, Checkbox, Form, TextArea } from "semantic-ui-react";

export default class ContentForm extends Component {
  state = {};

  onSuccessFullyPosted = () => {
    this.setState({ buttonSucess: true, buttonLoading: false });

    setInterval(() => this.setState({ buttonSucess: false }), 1000);
  };

  sendContent = () => {
    if (this.state.content && this.state.content.length > 0) {
      this.props.blockchainWrapper.newTransaction("content", this.state.content, this.onSuccessFullyPosted);
      this.setState({ buttonLoading: true });
    }
  };

  isLoading = () => {
    return this.state.buttonLoading;
  };
  isSuccessfull = () => {
    return !this.state.buttonLoading && this.state.buttonSucess;
  };

  render() {
    return (
      <Form>
        <Form.Field>
          <label>Post something!</label>
          <TextArea
            placeholder="Content"
            value={this.isSuccessfull() ? "" : null}
            onChange={e => this.setState({ content: e.target.value })}
          />
        </Form.Field>
        <Form.Field className="-text-right">
          <Button
            type="submit"
            loading={this.isLoading()}
            color={this.isSuccessfull() ? "green" : null}
            onClick={this.isLoading() ? null : this.sendContent}>
            {this.isSuccessfull() ? "Erfolgreich" : "Post"}
          </Button>
        </Form.Field>
      </Form>
    );
  }
}
