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
import FeedElement from "../components/FeedElement";

var request;

const panes = [
  {
    menuItem: 'Follower',
    render: (props) => {
      console.log(props);
      return null;
      const { visitedUser, user } = props.props.props.props;
      return (
        <Tab.Pane className="-tab">
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
            </Segment>
          </div>
        </Tab.Pane>
      );
    }
  },
  {
    menuItem: 'Post',
    render: (props) => {
      console.log(props);
      return null;
      const { visitedUser, user } = props.props.props.props;
      return (
        <Tab.Pane className="-tab">
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
            </Segment>
          </div>
        </Tab.Pane>
      );
    }
  },
  {
    menuItem: 'Ansehen',
    render: (props) => {
      console.log(props);
      return null;
      const { visitedUser, user } = props.props.props.props;
      return (
        <Tab.Pane className="-tab">
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
        </Tab.Pane>
      );
    }
  }
];

const Tabs = (props) => {
  return (<Tab panes={panes} props={{ props }} />)
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
        <Layout relPath="../" blockchainWrapper={this.blockchainWrapper} user={this.props.user}>
          <div className="-full-width -padding-10">
            <h1>Name, Gesamtansehen</h1>
            <Button floated="right" animated="fade" className="follow-button" onClick={() => this.handleFollow(this.props.visitedUser.name)}>
              <Button.Content visible>
                <Icon name="add user" size="large" />
              </Button.Content>
              <Button.Content hidden>Follow</Button.Content>
            </Button>
          </div>
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
