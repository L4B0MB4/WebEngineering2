import React, { Component } from "react";
import { Button, Checkbox, Form, TextArea, Input } from "semantic-ui-react";
import Request from "./utils/request";

export default class ContentForm extends Component {
    state = {};

    onSuccessFullyPosted = () => {
        this.setState({ buttonSucess: true, buttonLoading: false });
        setInterval(() => this.setState({ buttonSucess: false }), 1000);
    };

    sendContent = () => {
        if (this.state.content.length > 0) {
            this.props.blockchainWrapper.newTransaction("content", this.state.content, this.onSuccessFullyPosted);
            this.setState({ buttonLoading: true });
        }
    };

    uploadFile = (file) => {};

    isLoading = () => {
        return this.state.buttonLoading;
    };
    isSuccessfull = () => {
        return !this.state.buttonLoading && this.state.buttonSucess;
    };

    onSelectFiles = (files) => {
        // Files is a list because you can select several files
        // We just upload the first selected file
        const file = files[0];
        this.props.request.callUploadFile(file);
    };

    render() {
        return (
            <Form>
                <Form.Field>
                    <label>Post something!</label>
                    <TextArea
                        placeholder="Content"
                        value={this.isSuccessfull() ? "" : undefined}
                        onChange={(e) => this.setState({ content: e.target.value })}
                    />
                </Form.Field>
                <Form.Field>
                    <Input type="file" onChange={(e) => this.onSelectFiles(e.target.files)} />
                </Form.Field>
                <Form.Field className="-text-right">
                    <Button
                        type="submit"
                        loading={this.isLoading()}
                        color={this.isSuccessfull() ? "green" : null}
                        onClick={this.isLoading() ? null : this.sendContent}
                    >
                        {this.isSuccessfull() ? "Erfolgreich" : "Post"}
                    </Button>
                </Form.Field>
            </Form>
        );
    }
}
