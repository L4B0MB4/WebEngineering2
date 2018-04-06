import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input } from "semantic-ui-react";
import Request from "./utils/request";
const request = new Request();

class Follower extends Component {
    state = {};

    render() {
        const { followers, user } = this.props;
        return (
            <Tab.Pane className="-tab">
                <div className="-padding-10 -full-width">
                    <Segment raised compact className="-full-width -segment">
                        <Item.Group>
                            {followers
                                ? followers.map(follower => {
                                    if (!follower.user) return null;
                                    return (
                                        <Item key={follower.user.name}>
                                            <Item.Image size="tiny" src="../static/bild.jpeg" />
                                            <Item.Content verticalAlign="middle">
                                                <Item.Header>{follower.user.name}</Item.Header>
                                            </Item.Content>
                                        </Item>
                                    );
                                })
                                : null}
                        </Item.Group>
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

export default connect(mapStateToProps)(Follower);
