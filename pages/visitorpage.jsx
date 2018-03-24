import React, { Component, Fragment } from "react";
import {
  Image,
  Item,
  Segment,
  Feed,
  Icon,
  Label,
  Grid,
  Pagination,
  Button
} from "semantic-ui-react";
import {
  receiveUser,
  receiveVisitedUser
} from "../components/redux/actions/commonActions";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import withRedux from "next-redux-wrapper";
import initStore from "../components/redux/store";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import Request from "../components/utils/request";
const request = new Request();

class VisitorPage extends Component {
  static async getInitialProps({ store, query, req }) {
    if (req) {
      store.dispatch(receiveUser(query.user));
      store.dispatch(receiveVisitedUser(query.visitedUser));
    } else {
    }
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
    let publicKey = (await request.callGetPublicKey({ username })).data
      .publicKey;
    this.blockchainWrapper.newTransaction("follow", {
      following: publicKey
    });
  };

  render() {
    return (
      <Fragment>
        <Layout relPath="../">
          <Grid className="own-grid">
            <Grid.Row>
              <Grid.Column width={14}>
                <h1>Name, Gesamtansehen</h1>
              </Grid.Column>
              <Grid.Column width={2}>
                <Button
                  animated="fade"
                  className="follow-button"
                  onClick={() => this.handleFollow(this.props.visitedUser.name)}
                >
                  <Button.Content visible>
                    <Icon name="add user" size="large" />
                  </Button.Content>
                  <Button.Content hidden>Follow</Button.Content>
                </Button>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={7} stretched className="grid-column">
                <div className="-full-width -padding-10 -follower">
                  <h3>Follower</h3>
                  <Segment raised compact className="-full-width -segment">
                    <Item.Group>
                      <Item>
                        <Item.Image size="tiny" src="../static/bild.jpeg" />
                        <Item.Content verticalAlign="middle">
                          <Item.Header>Tino Metzger</Item.Header>
                        </Item.Content>
                      </Item>
                      <Item>
                        <Item.Image size="tiny" src="../static/bild.jpeg" />
                        <Item.Content verticalAlign="middle">
                          <Item.Header>Felix Waldbach</Item.Header>
                        </Item.Content>
                      </Item>
                      <Item>
                        <Item.Image size="tiny" src="../static/bild.jpeg" />
                        <Item.Content verticalAlign="middle">
                          <Item.Header>Lars Bommersbach</Item.Header>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                    <Pagination
                      size="mini"
                      siblingRange="0"
                      boundaryRange="0"
                      defaultActivePage={1}
                      totalPages={10}
                    />
                  </Segment>
                </div>
              </Grid.Column>

              <Grid.Column width={9} stretched className="grid-column">
                <div className="-full-width -padding-10 -posts">
                  <h3>Posts</h3>
                  <Segment raised compact className="-full-width -segment">
                    <Feed>
                      <Feed.Event>
                        <Feed.Label>
                          <img src="../static/bild.jpeg" />
                        </Feed.Label>
                        <Feed.Content>
                          <Feed.Summary>
                            Added <Feed.User>Lars Bommersbach</Feed.User> as a
                            friend
                            <Feed.Date>1 Hour Ago</Feed.Date>
                          </Feed.Summary>
                          <Feed.Meta>
                            <Feed.Like>
                              <Icon name="like" />4 Likes
                            </Feed.Like>
                          </Feed.Meta>
                        </Feed.Content>
                      </Feed.Event>
                      <Feed.Event>
                        <Feed.Label image="../static/bild.jpeg" />
                        <Feed.Content>
                          <Feed.Summary>
                            Added <a>2 new illustrations</a>
                            <Feed.Date>4 days ago</Feed.Date>
                          </Feed.Summary>
                          <Feed.Extra images>
                            <a>
                              <img src="../static/bild.jpeg" />
                            </a>
                            <a>
                              <img src="../static/bild.jpeg" />
                            </a>
                          </Feed.Extra>
                          <Feed.Meta>
                            <Feed.Like>
                              <Icon name="like" />1 Like
                            </Feed.Like>
                          </Feed.Meta>
                        </Feed.Content>
                      </Feed.Event>
                      <Feed.Event>
                        <Feed.Label image="../static/bild.jpeg" />
                        <Feed.Content>
                          <Feed.Summary>
                            Added <Feed.User>Tino Metzger</Feed.User> as a
                            friend
                            <Feed.Date>2 Days Ago</Feed.Date>
                          </Feed.Summary>
                          <Feed.Meta>
                            <Feed.Like>
                              <Icon name="like" />8 Likes
                            </Feed.Like>
                          </Feed.Meta>
                        </Feed.Content>
                      </Feed.Event>
                    </Feed>
                    <Pagination
                      size="mini"
                      siblingRange="0"
                      boundaryRange="0"
                      defaultActivePage={1}
                      totalPages={4}
                    />
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
  visitedUser: state.commonReducer.visitedUser
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  VisitorPage
);
