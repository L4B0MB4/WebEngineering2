import React, { Component, Fragment } from "react";
import io from "socket.io-client";
import withRedux from "next-redux-wrapper";
import NodeRSA from "node-rsa";
import { bindActionCreators } from "redux";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import { receiveBlockchainFeed, receiveUser } from "../components/redux/actions/commonActions";
import initStore from "../components/redux/store";
import Link from "next/link";
import Layout from "../components/layout.jsx";
import ContentForm from "../components/ContentForm";
import OwnFeed from "../components/OwnFeed";
import { Divider } from "semantic-ui-react";
import Request from "../components/utils/request";
import Profil from "../components/Profil";

const request = new Request();

class Index extends Component {
    static async getInitialProps({ store, query, req }) {
        if (req) {
            store.dispatch(receiveBlockchainFeed(query.blockchainFeed));
            store.dispatch(receiveUser(query.user));
        } else {
            let res = await request.callgetBlockchainFeed();
            query = { blockchainFeed: res.data.blockchainFeed };
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
        }
    }

    updateBlockchainFeed = async () => {
        let res = await request.callgetBlockchainFeed();
        this.props.receiveBlockchainFeed(res.data);
    };

    handleItemClick = (item) => {
        this.setState({ activeItem: item });
    };

    render() {
        return (
            <Layout handleItemClick={this.handleItemClick} blockchainWrapper={this.props.blockchainWrapper}>
                {this.state.activeItem === "profil" ? (
                    <Profil />
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
const mapDispatchToProps = (dispatch) => ({
    receiveBlockchainFeed: bindActionCreators(receiveBlockchainFeed, dispatch)
});

const mapStateToProps = (state) => ({
    blockchainFeed: state.commonReducer.blockchainFeed,
    user: state.commonReducer.user
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index);
