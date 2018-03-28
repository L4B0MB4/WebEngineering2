import React, { Component } from "react";
import { Button, Checkbox, Form, TextArea, Input } from "semantic-ui-react";
import Request from "./utils/request";

export default class ContentForm extends Component {
  state = {};

  onSuccessFullyPosted = () => {
    this.setState({ buttonSucess: true, buttonLoading: false });
    setInterval(() => this.setState({ buttonSucess: false }), 1000);
  };

  sendContent = async () => {
    if (this.state.content.length > 0 && !this.state.file) {
      this.props.blockchainWrapper.newTransaction("content", { text: this.state.content }, this.onSuccessFullyPosted);
      this.setState({ buttonLoading: true });
    } else if (this.state.file) {
      this.setState({ buttonLoading: true });
      const { data } = await this.props.request.callUploadFile(this.state.file);
      console.log(data);
      if (data.filename) {
        this.props.blockchainWrapper.newTransaction(
          "content",
          { text: this.state.content, picture: data.filename },
          this.onSuccessFullyPosted
        );
      }
    }
  };

  isLoading = () => {
    return this.state.buttonLoading;
  };
  isSuccessfull = () => {
    return !this.state.buttonLoading && this.state.buttonSucess;
  };

  onSelectFiles = files => {
    this.setState({ file: files[0] });
  };

  render() {
    return (
      <Form>
        <Form.Field>
          <label>Post something!</label>
          <TextArea
            placeholder="Content"
            value={this.isSuccessfull() ? "" : undefined}
            onChange={e => this.setState({ content: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Input type="file" onChange={e => this.onSelectFiles(e.target.files)} />
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
