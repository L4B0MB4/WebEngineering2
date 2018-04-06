import React, { Component, Fragment } from "react";
import { Grid, Modal, Image, Feed, Header } from "semantic-ui-react";
import Request from "../components/utils/request";
import FeedElementBig from "./FeedElementBig";
import FeedElementSmall from "./FeedElementSmall";
const request = new Request();
import { handleLike, handleShare } from "./utils/utils";

class OwnFeed extends Component {
  state = {};

  setModal = (openedImage, openedText) => {
    this.setState({ openModal: !this.state.openModal, openedImage, openedText });
  };

  render() {
    return (
      <Fragment>
        <Grid>
          <Grid.Row only="tablet computer">
            <Feed className="-full-width">
              {this.props.blockchainFeed
                ? this.props.blockchainFeed.map(item => {
                    if (item.user == undefined) return null;
                    return (
                      <FeedElementBig
                        item={item}
                        handleShare={() => handleShare(this.props.blockchainWrapper, this.props.user.name, item)}
                        handleLike={() => handleLike(this.props.blockchainWrapper, this.props.user.name, item.previousHash)}
                        request={request}
                        key={item.timestamp}
                        blockchainWrapper={this.props.blockchainWrapper}
                      />
                    );
                  })
                : null}
            </Feed>
          </Grid.Row>
          <Grid.Row only="mobile">
            <Feed className="-full-width">
              {this.props.blockchainFeed
                ? this.props.blockchainFeed.map(item => {
                    if (item.user == undefined) return null;
                    return (
                      <FeedElementSmall
                        item={item}
                        handleShare={() => handleShare(this.props.blockchainWrapper, this.props.user.name, item)}
                        handleLike={() => handleLike(this.props.blockchainWrapper, this.props.user.name, item.previousHash)}
                        request={request}
                        key={item.timestamp}
                        blockchainWrapper={this.props.blockchainWrapper}
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
