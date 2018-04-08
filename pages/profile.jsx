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
  receiveBlockchainWrapper
} from "../components/redux/actions/commonActions";
import initStore from "../components/redux/store";
import withRedux from "next-redux-wrapper";
import Link from "next/link";
import Request from "../components/utils/request";

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
    menuItem: "Ansehen",
    render: () => <Ansehen />
  },
  {
    menuItem: "Edit Profile",
    render: () => <EditProfile />
  }
];

const request = new Request();
class Profil extends Component {
  static async getInitialProps({ store, query, req }) {
    if (req) {
      store.dispatch(receiveBlockchainFeed(query.blockchainFeed));
      store.dispatch(receiveUser(query.user));
    } else {
      let res = await request.callgetBlockchainFeed();
      store.dispatch(receiveBlockchainFeed(res.data));
      res = await request.callgetUser();
      store.dispatch(receiveUser(res.data));
    }
  }

  constructor(props) {
    super(props);
    this.blockchainWrapper = new BlockchainWrapper();
    this.hasInit = false;
    this.state = {};
  }
  componentDidMount() {
    if (!this.hasInit && this.props.user) {
      this.blockchainWrapper.init(this.props.user.privateKey, this.updateBlockchainFeed);
      this.hasInit = true;
      this.props.receiveBlockchainWrapper(this.blockchainWrapper);
    }
  }

  render() {
    return (
      <Layout activeItem="profile" blockchainWrapper={this.blockchainWrapper} user={this.props.user}>
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
  receiveBlockchainWrapper: bindActionCreators(receiveBlockchainWrapper, dispatch)
});

const mapStateToProps = state => ({
  blockchainFeed: state.commonReducer.blockchainFeed,
  user: state.commonReducer.user,
  userContent: state.commonReducer.userContent,
  followers: state.commonReducer.followers,
  blockchainWrapper: state.commonReducer.blockchainWrapper
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Profil);
