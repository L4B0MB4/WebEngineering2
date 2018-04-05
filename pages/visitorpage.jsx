import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Button, Tab } from "semantic-ui-react";
import {
  receiveUser,
  receiveVisitedUser,
  receiveVisitedUserContent,
  receiveVisitedUserFollower,
  receiveBlockchainWrapper,
  receiveBlockchainFeed
} from "../components/redux/actions/commonActions";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import withRedux from "next-redux-wrapper";
import initStore from "../components/redux/store";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import Request from "../components/utils/request";
import { getDate } from "../components/utils/utils";
import FeedElementBig from "../components/FeedElementBig";

var request;

const panes = [
  {
    menuItem: "Follower",
    render: props => {
      const { followers, user } = props.props.props.props;
      return (
        <Tab.Pane className="-tab">
          <div className="-full-width -padding-10 -follower">
            <Segment raised compact className="-full-width -segment">
              <Item.Group>
                {props.followers
                  ? props.followers.map(follower => {
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
            </Segment>
          </div>
        </Tab.Pane>
      );
    }
  },
  {
    menuItem: "Posts",
    render: props => {
      const { userContent, user } = props.props.props.props;
      return (
        <Tab.Pane className="-tab">
          <div className="-full-width -padding-10 -posts">
            <Segment raised compact className="-full-width -segment">
              <Feed>
                {props.userContent
                  ? this.props.userContent.map(item => {
                      if (!props.visitedUser) return null;
                      return (
                        <FeedElementBig
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
            </Segment>
          </div>
        </Tab.Pane>
      );
    }
  },
  {
    menuItem: "Ansehen",
    render: props => {
      const { visitedUser, user } = props.props.props.props;
      return (
        <Tab.Pane className="-tab">
          <div className="-padding-10 -full-width -ansehen">
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
        </Tab.Pane>
      );
    }
  }
];

const Tabs = props => {
  return <Tab panes={panes} props={{ props }} />;
};

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
        <Layout handleItemClick={this.handleItemClick} relPath="../" blockchainWrapper={this.blockchainWrapper} user={this.props.user}>
          <div className="-full-width -padding-10">
            <h1>
              {this.props.visitedUser.name}, {this.props.visitedUser.ansehen} Ansehen
            </h1>
            <Button
              floated="right"
              animated="fade"
              className="follow-button"
              onClick={() => this.handleFollow(this.props.visitedUser.name)}>
              <Button.Content visible>
                <Icon name="add user" size="large" />
              </Button.Content>
              <Button.Content hidden>Follow</Button.Content>
            </Button>
          </div>
          <br />
          <br />
          <Tabs className="-tab" props={this.props} />
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
