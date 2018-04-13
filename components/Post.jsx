import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input, Container } from "semantic-ui-react";
import Request from "./utils/request";
import FeedElementBig from "../components/FeedElementBig";
const request = new Request();
import FeedElementSmall from "./FeedElementSmall";
import { handleLike, handleShare } from "./utils/utils";

class Post extends Component {
  state = {};

  render() {
    const { userContent, user, blockchainWrapper } = this.props;
    return (
      <Tab.Pane className="-tab">
        <Container>
          <div className="-padding-10 -full-width -posts">
            <Grid>
              <Grid.Row only="tablet computer">
                <Feed className="-full-width">
                  {userContent
                    ? userContent.map(item => {
                        item.user = user;
                        return (
                          <FeedElementBig
                            item={item}
                            handleShare={() => handleShare(blockchainWrapper, user.name, item)}
                            handleLike={() => handleLike(blockchainWrapper, user.name, item.previousHash)}
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
                  {userContent
                    ? userContent.map(item => {
                        item.user = user;
                        return (
                          <FeedElementSmall
                            item={item}
                            handleShare={() => handleShare(blockchainWrapper, user.name, item)}
                            handleLike={() => handleLike(blockchainWrapper, user.name, item.previousHash)}
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
          </div>
        </Container>
      </Tab.Pane>
    );
  }
}

const mapStateToProps = state => ({
  blockchainFeed: state.commonReducer.blockchainFeed,
  user: state.commonReducer.user,
  userContent: state.commonReducer.userContent,
  followers: state.commonReducer.followers,
  blockchainWrapper: state.commonReducer.blockchainWrapper
});

export default connect(mapStateToProps)(Post);
