import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input } from "semantic-ui-react";
import Request from "./utils/request";
const request = new Request();

class EditProfile extends Component {
    state = {};

    render() {
        console.log(this.props);
        return (
            <Tab.Pane className="-tab">
                <div className="-full-width -padding-10">
                    <Segment raised className="-full-width -segment">
                        <Form>
                            <Image src="../static/bild.jpeg" size="small" circular centered />
                            <br />
                            <Form.Field>
                                <label>Profile Picture</label>
                                <Input type="file" onChange={(e) => this.onSelectFiles(e.target.files)} className="upload" />
                            </Form.Field>
                            <Form.Field className="-text-right">
                                <Button
                                    type="submit"
                                    loading={this.isLoading()}
                                    color={this.isSuccessfull() ? "green" : null}
                                    onClick={this.isLoading() ? null : this.uploadProfilePicture}
                                >
                                    {this.isSuccessfull() ? "Success" : "Save Changes"}
                                </Button>
                            </Form.Field>
                        </Form>
                    </Segment>
                </div>
            </Tab.Pane>
        );
    }
    onSuccessFullyPosted = () => {
        this.setState({ buttonSucess: true, buttonLoading: false });
        setInterval(() => this.setState({ buttonSucess: false }), 1000);
    };
    isLoading = () => {
        return this.state.buttonLoading;
    };
    isSuccessfull = () => {
        return !this.state.buttonLoading && this.state.buttonSucess;
    };
    onSelectFiles = (files) => {
        this.setState({ file: files[0] });
    };
    uploadProfilePicture = async () => {
        this.setState({ buttonLoading: true });
        const { data } = await request.callUploadFile(this.state.file);
        if (data.filename) {
            this.props.blockchainWrapper.newTransaction("profilePicture", { picture: data.filename }, this.onSuccessFullyPosted);
        }
    };
}
const mapStateToProps = (state) => ({
    blockchainFeed: state.commonReducer.blockchainFeed,
    user: state.commonReducer.user,
    userContent: state.commonReducer.userContent,
    followers: state.commonReducer.followers,
    blockchainWrapper: state.commonReducer.blockchainWrapper
});
export default connect(mapStateToProps)(EditProfile);
