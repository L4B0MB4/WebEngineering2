import React, { Component, Fragment } from "react";
import io from "socket.io-client";
import withRedux from "next-redux-wrapper";
import NodeRSA from "node-rsa";
import { bindActionCreators } from "redux";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import {
  receiveBlockchainFeed,
  receiveUser,
  receiveVisitedUserContent,
  receiveVisitedUserFollower,
  receiveBlockchainWrapper,
  receiveNews
} from "../components/redux/actions/commonActions";
import initStore from "../components/redux/store";
import Link from "next/link";
import Layout from "../components/layout.jsx";
import ContentForm from "../components/ContentForm";
import OwnFeed from "../components/OwnFeed";
import { Divider } from "semantic-ui-react";
import Request from "../components/utils/request";
const request = new Request();

class Index extends Component {
  static async getInitialProps({ store, query, req }) {
    if (req) {
      store.dispatch(receiveBlockchainFeed(query.blockchainFeed));
      store.dispatch(receiveUser(query.user));
    } else {
      let res = await request.callgetFollowerFeed();
      store.dispatch(receiveBlockchainFeed(res.data));
      res = await request.callGetUser();
      store.dispatch(receiveUser(res.data));
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

  updateBlockchainFeed = async () => {
    let res = await request.callgetFollowerFeed(this.props.user.name);
    this.props.receiveBlockchainFeed(res.data);
  };

  render() {
    return (
      <Layout activeItem="feed" blockchainWrapper={this.blockchainWrapper} user={this.props.user}>
        <Fragment>
          <ContentForm blockchainWrapper={this.blockchainWrapper} request={request} />
          <Divider />
          <OwnFeed blockchainWrapper={this.blockchainWrapper} blockchainFeed={this.props.blockchainFeed} user={this.props.user} />
        </Fragment>
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
  news: state.commonReducer.news
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index);
