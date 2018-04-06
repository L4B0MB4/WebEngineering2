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
  receiveBlockchainWrapper
} from "../components/redux/actions/commonActions";
import initStore from "../components/redux/store";
import Link from "next/link";
import Layout from "../components/layout.jsx";
import ContentForm from "../components/ContentForm";
import OwnFeed from "../components/OwnFeed";
import { Divider } from "semantic-ui-react";
import Request from "../components/utils/request";
import Profil from "../components/Profil";
import Kontakt from "../components/kontakt";
import Impressum from "../components/impressum";
import FeaturedProfiles from "../components/FeaturedProfiles"

const request = new Request();

class Index extends Component {
  static async getInitialProps({ store, query, req }) {
    if (req) {
      store.dispatch(receiveBlockchainFeed(query.blockchainFeed));
      store.dispatch(receiveUser(query.user));
      store.dispatch(receiveVisitedUserContent(query.userContent));
      store.dispatch(receiveVisitedUserFollower(query.followers));
    } else {
      let res = await request.callgetBlockchainFeed();
      query = { blockchainFeed: res.data.data.blockchainFeed };
      store.dispatch(receiveBlockchainFeed(query));
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

  updateBlockchainFeed = async () => {
    let res = await request.callgetFollowerFeed(this.props.user.name);
    this.props.receiveBlockchainFeed(res.data);
  };

  handleItemClick = item => {
    this.setState({ activeItem: item });
  };

  render() {
    return (
      <Layout handleItemClick={this.handleItemClick} blockchainWrapper={this.blockchainWrapper} user={this.props.user}>
        {this.state.activeItem === "profil" ? (
          <Profil followers={this.props.followers} userContent={this.props.userContent} user={this.props.user} />
        ) : this.state.activeItem === "kontakt" ? (
          <Kontakt />
        ) : this.state.activeItem === "impressum" ? (
          <Impressum />
        ) : this.state.activeItem === "featured" ? ( 
          <FeaturedProfiles />
        ) : (
                <Fragment>
                  <ContentForm blockchainWrapper={this.blockchainWrapper} request={request} />
                  <Divider />
                  <OwnFeed blockchainWrapper={this.blockchainWrapper} blockchainFeed={this.props.blockchainFeed} />
                </Fragment>
              )}
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index);
