import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Button, Tab } from "semantic-ui-react";
import {
  receiveUser,
  receiveVisitedUser,
  receiveVisitedUserContent,
  receiveVisitedUserFollower,
  receiveBlockchainWrapper,
  receiveBlockchainFeed,
  receiveLikes,
  receiveNews
} from "../components/redux/actions/commonActions";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import withRedux from "next-redux-wrapper";
import { bindActionCreators } from "redux";
import initStore from "../components/redux/store";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import Request from "../components/utils/request";
import { getDate } from "../components/utils/utils";
import FeedElementBig from "../components/FeedElementBig";
import Follower from "../components/Follower";
import Post from "../components/Post";
import Ansehen from "../components/Ansehen";
import Lux from "../components/Lux";

var request;

const panes = [
  {
    menuItem: "Followers",
    render: () => <Follower />
  },
  {
    menuItem: "Posts",
    render: () => <Post />
  },
  {
    menuItem: "Kudos",
    render: () => <Ansehen />
  }
];

class VisitorPage extends Component {
  static async getInitialProps({ store, query, req }) {
    const baseUrl = `${req.protocol}://${req.get("Host")}`;
    request = new Request(baseUrl);
    if (req) {
      store.dispatch(receiveUser(query.user));
      store.dispatch(receiveVisitedUser(query.visitedUser));
      store.dispatch(receiveLikes(query.likes));
    }
    receiveNews([]);
  }

  constructor(props) {
    super(props);
    this.blockchainWrapper = new BlockchainWrapper();
    this.hasInit = false;
    this.state = {};
  }

  async componentDidMount() {
    if (!this.hasInit && this.props.user) {
      this.blockchainWrapper.init(this.props.user.privateKey, this.updateBlockchainFeed, this.onNews);
      this.hasInit = true;
      this.props.receiveBlockchainWrapper(this.blockchainWrapper);
      request = new Request();
      let { data } = await request.callGetUserContent(this.props.visitedUser.name);
      this.props.receiveVisitedUserContent(data);
      data = (await request.callGetUserFollower(this.props.visitedUser.name)).data;
      this.props.receiveVisitedUserFollower(data);
    }
  }
  onNews = news => {
    const newsarr = [];
    newsarr.push(...(this.props.news ? this.props.news : []));
    newsarr.push(news);
    this.props.receiveNews(newsarr);
  };

  handleFollow = async username => {
    let publicKey = (await new Request().callGetPublicKey({ username })).data.publicKey;

    if (!this.blockchainWrapper.alreadyFollowed(publicKey)) {
      this.blockchainWrapper.newTransaction(
        "follow",
        {
          following: publicKey
        },
        () => {
          this.setState({ followed: true });
        }
      );
    }
  };

  render() {
    return (
      <Layout blockchainWrapper={this.blockchainWrapper} user={this.props.user} request={request}>
        <div className="-full-width -padding-10">
          <h1>
            {this.props.visitedUser.name}, {this.props.visitedUser.ansehen} Kudos
          </h1>
          <Button
            floated="right"
            animated="fade"
            className={this.state.followed ? "-follow-button-success" : "-follow-button"}
            onClick={this.state.followed ? null : () => this.handleFollow(this.props.visitedUser.name)}>
            <Button.Content visible>
              <Icon name="add user" size="large" />
            </Button.Content>
            <Button.Content hidden>Follow</Button.Content>
          </Button>
        </div>
        <br />
        <br />
        <Tab className="-tab" panes={panes} props={this.props} />
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  receiveNews: bindActionCreators(receiveNews, dispatch),
  receiveBlockchainWrapper: bindActionCreators(receiveBlockchainWrapper, dispatch),
  receiveVisitedUserContent: bindActionCreators(receiveVisitedUserContent, dispatch),
  receiveVisitedUserFollower: bindActionCreators(receiveVisitedUserFollower, dispatch)
});

const mapStateToProps = state => ({
  user: state.commonReducer.user,
  visitedUser: state.commonReducer.visitedUser,
  userContent: state.commonReducer.userContent,
  followers: state.commonReducer.followers,
  news: state.commonReducer.news
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(VisitorPage);
