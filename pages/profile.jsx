import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input, Container } from "semantic-ui-react";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import FeedElementBig from "../components/FeedElementBig";
import EditProfile from "../components/EditProfile";
import Follower from "../components/Follower";
import Post from "../components/Post";
import Ansehen from "../components/Ansehen";
import { bindActionCreators } from "redux";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import {
  receiveBlockchainFeed,
  receiveUser,
  receiveVisitedUserContent,
  receiveVisitedUserFollower,
  receiveBlockchainWrapper,
  receiveLikes,
  receiveNews
} from "../components/redux/actions/commonActions";
import initStore from "../components/redux/store";
import withRedux from "next-redux-wrapper";
import Link from "next/link";
import Request from "../components/utils/request";
import Lux from "../components/Lux";

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
  },
  {
    menuItem: "Edit",
    render: () => <EditProfile />
  }
];

const request = new Request();
class Profil extends Component {
  static async getInitialProps({ store, query, req }) {
    if (req) {
      store.dispatch(receiveBlockchainFeed(query.blockchainFeed));
      store.dispatch(receiveUser(query.user));
      store.dispatch(receiveLikes(query.likes));
      store.dispatch(receiveVisitedUserContent(query.userContent));
      store.dispatch(receiveVisitedUserFollower(query.followers));
    } else {
      let res = await request.callgetFollowerFeed();
      store.dispatch(receiveBlockchainFeed(res.data));
      let userres = await request.callGetUser();
      store.dispatch(receiveUser(userres.data));
      res = await request.callGetUserLikes(userres.data.name);
      store.dispatch(receiveLikes(res.data));
      res = await request.callGetUserContent(userres.data.name);
      store.dispatch(receiveVisitedUserContent(res.data));
      res = await request.callGetUserFollower(userres.data.name);
      store.dispatch(receiveVisitedUserFollower(res.data));
    }
    receiveNews([]);
  }

  constructor(props) {
    super(props);
    this.blockchainWrapper = new BlockchainWrapper();
    this.hasInit = false;
    this.state = {};
  }
  componentDidMount() {
    if (!this.hasInit && this.props.user) {
      this.blockchainWrapper.init(this.props.user.privateKey, this.updateBlockchainFeed, this.onNews);
      this.hasInit = true;
      this.props.receiveBlockchainWrapper(this.blockchainWrapper);
    }
  }
  onNews = news => {
    const newsarr = [];
    newsarr.push(...(this.props.news ? this.props.news : []));
    newsarr.push(news);
    this.props.receiveNews(newsarr);
  };

  render() {
    return (
      <Layout activeItem="profile" blockchainWrapper={this.blockchainWrapper} user={this.props.user} request={request}>
        <h1>Your Profile</h1>
        <br />
        <br />
        <Tab className="-tab" panes={panes} props={this.props} />
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  receiveBlockchainFeed: bindActionCreators(receiveBlockchainFeed, dispatch),
  receiveBlockchainWrapper: bindActionCreators(receiveBlockchainWrapper, dispatch),
  receiveNews: bindActionCreators(receiveNews, dispatch)
});

const mapStateToProps = state => ({
  blockchainFeed: state.commonReducer.blockchainFeed,
  user: state.commonReducer.user,
  userContent: state.commonReducer.userContent,
  followers: state.commonReducer.followers,
  blockchainWrapper: state.commonReducer.blockchainWrapper,
  likes: state.commonReducer.likes,
  news: state.commonReducer.news
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Profil);
