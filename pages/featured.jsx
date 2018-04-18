import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input, Container, Card } from "semantic-ui-react";
import OwnHeader from "../components/Header.jsx";
import Link from "next/link";
import Layout from "../components/layout.jsx";
import FeedElementBig from "../components/FeedElementBig";
import Request from "../components/utils/request";
import withRedux from "next-redux-wrapper";
import initStore from "../components/redux/store";
import { bindActionCreators } from "redux";
import {
    receiveBlockchainFeed,
    receiveUser,
    receiveVisitedUserContent,
    receiveVisitedUserFollower,
    receiveBlockchainWrapper,
    receiveNews,
    receiveFeaturedUsers
} from "../components/redux/actions/commonActions";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import Lux from "../components/Lux";

var request;
class FeaturedProfiles extends Component {
    static async getInitialProps({ store, query, req }) {
        receiveNews([]);
        if (req) {
            const baseUrl = `${req.protocol}://${req.get("Host")}`;
            request = new Request(baseUrl);
            store.dispatch(receiveBlockchainFeed(query.blockchainFeed));
            store.dispatch(receiveUser(query.user));
            let res = await request.callGetFeaturedUsers();
            store.dispatch(receiveFeaturedUsers(res.data));
        } else {
            request = new Request();
            let res = await request.callgetFollowerFeed();
            store.dispatch(receiveBlockchainFeed(res.data));
            res = await request.callGetUser();
            store.dispatch(receiveUser(res.data));
            res = await request.callGetFeaturedUsers();
            store.dispatch(receiveFeaturedUsers(res.data));
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
        const { featuredUsers } = this.props;
        return (
            <Lux>
                <Layout activeItem="featured" blockchainWrapper={this.blockchainWrapper} user={this.props.user} request={request}>
                    <div className="-text-center">
                        <h1>!! The Top {featuredUsers ? featuredUsers.length : ""} Users right now !!</h1>
                        <br />
                        <br />
                        <br />
                        <Grid>
                            <Grid.Row only="tablet computer" columns={3} textAlign="center">
                                {featuredUsers
                                    ? featuredUsers.map(item => (
                                        <Grid.Column key={item.user.name}>
                                            <Link href={"./visit/" + item.user.name}>
                                                <Button animated="fade" className="featured-user">
                                                    <Button.Content className="-visible">
                                                        <Image
                                                            fluid
                                                            src={
                                                                item.user && item.user.profilePicture ? "/api/picture/" + item.user.profilePicture : "../static/bild.jpeg"
                                                            }
                                                            className="-image"
                                                        />
                                                    </Button.Content>
                                                    <Button.Content hidden>{item.user.name}</Button.Content>
                                                </Button>
                                            </Link>
                                            <br />
                                            {item.user.name} - {item.ansehen} Kudos
                      </Grid.Column>
                                    ))
                                    : null}
                            </Grid.Row>
                            <Grid.Row only="mobile" columns={2} textAlign="center">
                                {featuredUsers
                                    ? featuredUsers.map(item => (
                                        <Grid.Column key={item.user.name}>
                                            <Link href={"./visit/" + item.user.name}>
                                                <Button animated="fade" className="featured-user">
                                                    <Button.Content className="-visible">
                                                        <Image
                                                            fluid
                                                            src={
                                                                item.user && item.user.profilePicture ? "/api/picture/" + item.user.profilePicture : "../static/bild.jpeg"
                                                            }
                                                            className="-image"
                                                        />
                                                    </Button.Content>
                                                    <Button.Content hidden>{item.user.name}</Button.Content>
                                                </Button>
                                            </Link>
                                            <br />
                                            {item.user.name} - {item.ansehen} Kudos
                      </Grid.Column>
                                    ))
                                    : null}
                            </Grid.Row>
                        </Grid>
                    </div>
                </Layout>
            </Lux>
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
    news: state.commonReducer.news,
    featuredUsers: state.commonReducer.featuredUsers
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(FeaturedProfiles);
