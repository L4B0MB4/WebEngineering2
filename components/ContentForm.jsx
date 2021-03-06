import React, { Component } from "react";
import { Button, Checkbox, Form, TextArea, Input } from "semantic-ui-react";

export default class ContentForm extends Component {
  state = {
    content: ""
  };

  onSuccessFullyPosted = () => {
    if (this.state.inputImage) this.state.inputImage.value = "";
    this.setState({ content: "", buttonSucess: true, buttonLoading: false, file: undefined });
    setInterval(() => this.setState({ buttonSucess: false }), 1000);
  };

  onErrorPosted = () => {
    if (this.state.inputImage) this.state.inputImage.value = "";
    this.setState({ content: "", buttonError: true, buttonLoading: false, file: undefined });
    setInterval(() => this.setState({ buttonError: false }), 1000);
  };

  isLoading = () => {
    return this.state.buttonLoading;
  };
  isSuccessfull = () => {
    return !this.state.buttonLoading && this.state.buttonSucess;
  };

  isError = () => {
    return !this.state.buttonLoading && this.state.buttonError;
  };

  sendContent = async () => {
    if (this.state.content.length > 0 && !this.state.file) {
      this.props.blockchainWrapper.newTransaction("content", { text: this.state.content }, this.onSuccessFullyPosted);
      this.setState({ buttonLoading: true });
    } else if (this.state.file) {
      this.setState({ buttonLoading: true });
      const res = await this.props.request.callUploadFile(this.state.file);
      if (res.data && res.data.filename) {
        this.props.blockchainWrapper.newTransaction(
          "content",
          { text: this.state.content, picture: res.data.filename },
          this.onSuccessFullyPosted
        );
      } else {
        this.onErrorPosted();
      }
    }
  };
  onSelectFiles = e => {
    this.setState({ inputImage: e.target, file: e.target.files[0] });
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
          <Input type="file" accept="image/*" onChange={e => this.onSelectFiles(e)} className="upload" />
        </Form.Field>
        <Form.Field className="-text-right">
          <Button
            type="submit"
            loading={this.isLoading()}
            color={this.isSuccessfull() ? "green" : this.isError() ? "red" : null}
            onClick={this.isLoading() ? null : this.sendContent}>
            {this.isSuccessfull() ? "Success" : this.isError() ? "Error" : "Post"}
          </Button>
        </Form.Field>
      </Form>
    );
  }
}
