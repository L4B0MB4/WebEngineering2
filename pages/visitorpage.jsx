import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Button } from "semantic-ui-react";
import {
  receiveUser,
  receiveVisitedUser,
  receiveVisitedUserContent,
  receiveVisitedUserFollower
} from "../components/redux/actions/commonActions";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import withRedux from "next-redux-wrapper";
import initStore from "../components/redux/store";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import Request from "../components/utils/request";
import { getDate } from "../components/utils/utils";
import FeedElement from "../components/FeedElement";

var request;

class VisitorPage extends Component {
  static async getInitialProps({ store, query, req }) {
    const baseUrl = `${req.protocol}://${req.get("Host")}`;
    request = new Request(baseUrl);
    if (req) {
      store.dispatch(receiveUser(query.user));
      store.dispatch(receiveVisitedUser(query.visitedUser));
    } else {
    }
    let { data } = await request.callGetUserContent(query.visitedUser.name);
    store.dispatch(receiveVisitedUserContent(data));
    data = (await request.callGetUserFollower(query.visitedUser.name)).data;
    store.dispatch(receiveVisitedUserFollower(data));
    return {};
  }

  constructor(props) {
    super(props);
    this.blockchainWrapper = new BlockchainWrapper();
    this.hasInit = false;
  }

  componentDidMount() {
    if (!this.hasInit && this.props.user) {
      this.blockchainWrapper.init(this.props.user.privateKey);
      this.hasInit = true;
    }
  }

  handleFollow = async username => {
    let publicKey = (await new Request().callGetPublicKey({ username })).data.publicKey;
    this.blockchainWrapper.newTransaction("follow", {
      following: publicKey
    });
  };



  render() {
    return (
      <Fragment>
        <Layout relPath="../" blockchainWrapper={this.blockchainWrapper} user={this.props.user}>
          <Grid className="own-grid">
            <Grid.Row>
              <div className="-full-width -padding-10">
                <h1>Name, Gesamtansehen</h1>
                <Button animated="fade" className="follow-button" onClick={() => this.handleFollow(this.props.visitedUser.name)}>
                  <Button.Content visible>
                    <Icon name="add user" size="large" />
                  </Button.Content>
                  <Button.Content hidden>Follow</Button.Content>
                </Button>
              </div>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={7} stretched className="grid-column">
                <div className="-full-width -padding-10 -follower">
                  <h3>Follower</h3>
                  <Segment raised compact className="-full-width -segment">
                    <Item.Group>
                      {this.props.followers
                        ? this.props.followers.map(follower => {
                          if (!follower.user) return null;
                          return (
                            <Item key={follower.user.name}>
                              <Item.Image size="tiny" src="../static/bild.jpeg" />
                              <Item.Content verticalAlign="middle">
                                <Item.Header>{follower.user.name}</Item.Header>
                              </Item.Content>
                            </Item>
                          );
                        })
                        : null}
                    </Item.Group>
                    <Pagination size="mini" siblingRange="0" boundaryRange="0" defaultActivePage={1} totalPages={10} />
                  </Segment>
                </div>
              </Grid.Column>

              <Grid.Column width={9} stretched className="grid-column">
                <div className="-full-width -padding-10 -posts">
                  <h3>Posts</h3>
                  <Segment raised compact className="-full-width -segment">
                    <Feed>
                      {this.props.userContent
                        ? this.props.userContent.map(item => {
                          if (!this.props.visitedUser) return null;
                          return (
                            <FeedElement
                              item={item}
                              user={this.props.visitedUser}
                              handleShare={this.handleShare}
                              handleLike={this.handleLike}
                              request={request}
                              key={item.timestamp}
                            />
                          );
                        })
                        : null}
                    </Feed>
                    <Pagination size="mini" siblingRange="0" boundaryRange="0" defaultActivePage={1} totalPages={4} />
                  </Segment>
                </div>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <div className="-padding-10 -full-width -ansehen">
                <h3>Ansehen</h3>
                <Segment raised className="-segment">
                  <Label as="a">
                    <Image avatar spaced="right" src="../static/bild.jpeg" />
                    Apple, 3
                  </Label>
                  <Label as="a">
                    <Image avatar spaced="right" src="../static/bild.jpeg" />
                    Nike, 2
                  </Label>
                  <Label as="a">
                    <Image avatar spaced="right" src="../static/bild.jpeg" />
                    Reebok, 1
                  </Label>
                  <Label as="a">
                    <Image avatar spaced="right" src="../static/bild.jpeg" />
                    Gucci, 4
                  </Label>
                </Segment>
              </div>
            </Grid.Row>
          </Grid>
        </Layout>
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({
  user: state.commonReducer.user,
  visitedUser: state.commonReducer.visitedUser,
  userContent: state.commonReducer.userContent,
  followers: state.commonReducer.followers
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(VisitorPage);
