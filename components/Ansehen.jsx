import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input } from "semantic-ui-react";
import Request from "./utils/request";
const request = new Request();

class Ansehen extends Component {
    state = {};

    render() {
        const { userContent, user } = this.props;
        return (
            <Tab.Pane className="-tab">
                <div className="-full-width -padding-10">
                    <Segment raised className="-full-width -segment">
                        <Label as="a">
                            <Image avatar spaced="right" src="../static/bild.jpeg" />
                            Apple, 3
              </Label>
                        <Label as="a">
                            <Image avatar spaced="right" src="../static/bild.jpeg" />
                            Nike, 2
              </Label>
                        <Label as="a">
                            <Image avatar spaced="right" src="../static/bild.jpeg" />
                            Reebok, 1
              </Label>
                        <Label as="a">
                            <Image avatar spaced="right" src="../static/bild.jpeg" />
                            Gucci, 4
              </Label>
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

export default connect(mapStateToProps)(Ansehen);
