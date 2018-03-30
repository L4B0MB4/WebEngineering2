import React, { Component, Fragment } from "react";
import { Modal, Image, Feed, Header } from "semantic-ui-react";
import Request from "../components/utils/request";
import FeedElement from "./FeedElement";
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
        <Modal open={this.state.openModal} closeIcon={true} onClose={this.setModal}>
          <Modal.Content image>
            <Image wrapped size="medium" src={this.state.openedImage} />
            <Modal.Description>
              <p>{this.state.openedText}</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
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
                    setModal={this.setModal}
                  />
                );
              })
            : null}
        </Feed>
      </Fragment>
    );
  }
}

export default OwnFeed;
