import React, { Component, Fragment } from "react";
import { Button, Feed, Icon, Segment, Grid, Image, Container, Dropdown } from "semantic-ui-react";
import Request from "../components/utils/request";
import FeedElement from "./FeedElement";
const request = new Request();

class OwnFeed extends Component {
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

  render() {
    return (
      <Feed>
        {this.props.blockchainFeed
          ? this.props.blockchainFeed.map(item => {
              if (item.user == undefined) return null;
              return (
                <FeedElement
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
    );
  }
}

export default OwnFeed;
