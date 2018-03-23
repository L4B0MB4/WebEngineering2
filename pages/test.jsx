import React, { Component } from "react";
import io from "socket.io-client";
import withRedux from "next-redux-wrapper";
import NodeRSA from "node-rsa";
import { bindActionCreators } from "redux";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import { receiveBlockchainFeed } from "../components/redux/actions/commonActions";
import initStore from "../components/redux/store";
import Link from "next/link";

class Test extends Component {
  static getInitialProps({ store, query, req }) {
    if (req) {
      store.dispatch(receiveBlockchainFeed(query));
    } else {
    }
  }

  constructor(props) {
    super(props);
    this.blockchainWrapper = new BlockchainWrapper();
    this.hasInit = false;
  }
  componentDidMount() {
    if (!this.hasInit) {
      console.log(this.blockchainWrapper);
      this.blockchainWrapper.init();
      this.hasInit = true;
    }
  }
  render() {
    return (
      <div>
        <Link prefetch href={"/"}>
          <a className="whitesmoke">Test !</a>
        </Link>Just a test page ! You have full access to the blockchain via the
        blockchainwrapper !
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  receiveBlockchainFeed: bindActionCreators(receiveBlockchainFeed, dispatch)
});

const mapStateToProps = state => ({
  blockchainFeed: state.commonReducer.payload
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Test);
