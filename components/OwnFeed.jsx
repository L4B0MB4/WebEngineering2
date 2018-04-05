import React, { Component, Fragment } from "react";
import { Grid, Modal, Image, Feed, Header } from "semantic-ui-react";
import Request from "../components/utils/request";
import FeedElementBig from "./FeedElementBig";
import FeedElementSmall from "./FeedElementSmall";
const request = new Request();

class OwnFeed extends Component {
  state = {};

  handleLike = async (username, previousHash) => {
    let publicKey = (await request.callGetPublicKey({ username })).data.publicKey;
    if (!this.props.blockchainWrapper.alreadyLiked(previousHash, publicKey)) {
      this.props.blockchainWrapper.newTransaction("like", {
        previousHash,
        userKey: publicKey
      });
    }
  };

  handleShare = async (username, item) => {
    if (item.shared) return;
    let publicKey = (await request.callGetPublicKey({ username })).data.publicKey;
    this.props.blockchainWrapper.newTransaction("share", {
      previousHash: item.previousHash,
      userKey: publicKey
    });
  };

  setModal = (openedImage, openedText) => {
    this.setState({ openModal: !this.state.openModal, openedImage, openedText });
  };

  render() {
    return (
      <Fragment>
        <Grid>
          <Grid.Row only="tablet computer">
            <Feed>
              {this.props.blockchainFeed
                ? this.props.blockchainFeed.map(item => {
                    if (item.user == undefined) return null;
                    return (
                      <FeedElementBig
                        item={item}
                        handleShare={this.handleShare}
                        handleLike={this.handleLike}
                        request={request}
                        key={item.timestamp}
                      />
                    );
                  })
                : null}
            </Feed>
          </Grid.Row>
          <Grid.Row only="mobile">
            <Feed>
              {this.props.blockchainFeed
                ? this.props.blockchainFeed.map(item => {
                    if (item.user == undefined) return null;
                    return (
                      <FeedElementSmall
                        item={item}
                        handleShare={this.handleShare}
                        handleLike={this.handleLike}
                        request={request}
                        key={item.timestamp}
                      />
                    );
                  })
                : null}
            </Feed>
          </Grid.Row>
        </Grid>
      </Fragment>
    );
  }
}

export default OwnFeed;
