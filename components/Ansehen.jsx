import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input } from "semantic-ui-react";
import Request from "./utils/request";
const request = new Request();

class Ansehen extends Component {
  state = {};

  render() {
    const { userContent, user, likes } = this.props;
    return (
      <Tab.Pane className="-tab">
        <div className="-full-width -padding-10">
          <Segment raised className="-full-width -segment">
            {likes
              ? likes.map(item => {
                  return (
                    <Label as="a" key={item.user}>
                      <Image avatar spaced="right" src="../static/bild.jpeg" />
                      {item.user} gave you {item.likes} likes!
                    </Label>
                  );
                })
              : null}
          </Segment>
        </div>
      </Tab.Pane>
    );
  }
}

const mapStateToProps = state => ({
  blockchainFeed: state.commonReducer.blockchainFeed,
  user: state.commonReducer.user,
  userContent: state.commonReducer.userContent,
  followers: state.commonReducer.followers,
  blockchainWrapper: state.commonReducer.blockchainWrapper,
  likes: state.commonReducer.likes
});

export default connect(mapStateToProps)(Ansehen);
