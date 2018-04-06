import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input } from "semantic-ui-react";
import Request from "./utils/request";
import FeedElementBig from "../components/FeedElementBig";
const request = new Request();

class Post extends Component {
    state = {};

    render() {
        const { userContent, user } = this.props;
        return (
            <Tab.Pane className="-tab">
                <div className="-padding-10 -full-width -posts">
                    <Segment raised compact className="-full-width -segment">
                        <Feed>
                            {userContent
                                ? userContent.map(item => {
                                    if (!user) return null;
                                    return (
                                        <FeedElementBig
                                            item={item}
                                            user={user}
                                            handleShare={undefined}
                                            handleLike={undefined}
                                            request={undefined}
                                            key={item.timestamp}
                                        />
                                    );
                                })
                                : null}
                        </Feed>
                    </Segment>
                </div>
            </Tab.Pane>
        );
    }
}

const mapStateToProps = state => ({
    blockchainFeed: state.commonReducer.blockchainFeed,
    user: state.commonReducer.user,
    userContent: state.commonReducer.userContent,
    followers: state.commonReducer.followers,
    blockchainWrapper: state.commonReducer.blockchainWrapper
});

export default connect(mapStateToProps)(Post);
