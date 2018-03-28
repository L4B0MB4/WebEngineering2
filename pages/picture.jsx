import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Button } from "semantic-ui-react";
import {
    receiveUser,
    receiveVisitedUser,
    receiveVisitedUserContent,
    receiveVisitedUserFollower
} from "../components/redux/actions/commonActions";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import withRedux from "next-redux-wrapper";
import initStore from "../components/redux/store";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import Request from "../components/utils/request";
import { getDate } from "../components/utils/utils";

var request;
class VisitorPage extends Component {
    render() {
        return (
            <Fragment>
<<<<<<< HEAD
                <Layout relPath="../" blockchainWrapper={this.props.blockchainWrapper}>
                    <form ref="uploadForm" id="uploadForm" action="/api/upload" method="post" encType="multipart/form-data">
=======
                <Layout relPath="../" blockchainWrapper={this.blockchainWrapper}>
                    <form ref="uploadForm" id="uploadForm" action="/upload" method="post" encType="multipart/form-data">
>>>>>>> 2dbed645ebfcaee9ab313dc1cf283ce175bc8901
                        <input type="file" name="sampleFile" />
                        <input type="submit" value="Upload!" />
                    </form>
                </Layout>
            </Fragment>
        );
    }
}

export default VisitorPage;
