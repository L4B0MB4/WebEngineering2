import React, { Component } from "react";
import io from "socket.io-client";
import withRedux from "next-redux-wrapper";
import NodeRSA from "node-rsa";
import { bindActionCreators } from "redux";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import { receiveBlockchainFeed } from "../components/redux/actions/commonActions";
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
      store.dispatch(receiveBlockchainFeed(query));
    } else {
      let res = await request.callgetBlockchainFeed();
      query = {
        blockchainFeed: res.data
      };
      store.dispatch(receiveBlockchainFeed(query));
    }
  }

  constructor(props) {
    super(props);
    this.blockchainWrapper = new BlockchainWrapper();
    this.hasInit = false;
  }
  componentDidMount() {
    if (!this.hasInit) {
      this.blockchainWrapper.init();
      this.hasInit = true;
    }
  }
  render() {
    return (
      <Layout>
        <Link prefetch href={"/test"}>
          <a className="whitesmoke">Test !</a>
        </Link>

        <ContentForm blockchainWrapper={this.blockchainWrapper} />
        <Divider />
        <OwnFeed blockchainFeed={this.props.blockchainFeed} />
      </Layout>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  receiveBlockchainFeed: bindActionCreators(receiveBlockchainFeed, dispatch)
});

const mapStateToProps = state => ({
  blockchainFeed: state.commonReducer.payload
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index);
