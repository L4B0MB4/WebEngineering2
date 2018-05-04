import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input } from "semantic-ui-react";
import Request from "./utils/request";
const request = new Request();

class EditProfile extends Component {
  state = {};

  render() {
    const { user } = this.props;
    const { preloadeImage } = this.state;
    return (
      <Tab.Pane className="-tab">
        <div className="-full-width -padding-10">
          <Segment raised className="-full-width -segment">
            <Form>
              <div className="-square" style={{ maxWidth: "200px" }}>
                <img
                  src={
                    preloadeImage
                      ? preloadeImage
                      : user && user.profilePicture
                        ? "/api/picture/" + user.profilePicture
                        : "../static/bild.jpeg"
                  }
                  className="-content"
                />
              </div>
              <br />
              <Form.Field>
                <label>Profile Picture</label>
                <Input type="file" accept="image/*" onChange={e => this.onSelectFiles(e.target.files)} className="upload" />
              </Form.Field>
              <Form.Field className="-text-right">
                <Button
                  type="submit"
                  loading={this.isLoading()}
                  color={this.isSuccessfull() ? "green" : this.isError() ? "red" : null}
                  onClick={this.isLoading() ? null : this.uploadProfilePicture}>
                  {this.isSuccessfull() ? "Success" : this.isError() ? "Error" : "Save Changes"}
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
    location.reload();
  };
  onErrorPosted = () => {
    if (this.state.inputImage) this.state.inputImage.value = "";
    this.setState({ buttonError: true, buttonLoading: false });
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
  onSelectFiles = files => {
    this.setState({ file: files[0] });
    var reader = new FileReader();
    reader.onload = e => {
      this.setState({ preloadeImage: e.target.result });
    };
    reader.readAsDataURL(files[0]);
  };
  uploadProfilePicture = async () => {
    this.setState({ buttonLoading: true });
    const res = await request.callUploadFile(this.state.file);
    if (res.data && res.data.filename) {
      this.props.blockchainWrapper.newTransaction("profilePicture", { picture: res.data.filename }, this.onSuccessFullyPosted);
    } else {
      this.onErrorPosted();
    }
  };
}
const mapStateToProps = state => ({
  blockchainFeed: state.commonReducer.blockchainFeed,
  user: state.commonReducer.user,
  userContent: state.commonReducer.userContent,
  followers: state.commonReducer.followers,
  blockchainWrapper: state.commonReducer.blockchainWrapper
});
export default connect(mapStateToProps)(EditProfile);
