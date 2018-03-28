import React, { Component, Fragment } from "react";
import { Menu, Container } from "semantic-ui-react";

export default class Header extends Component {
    render() {
        return (
            <Fragment>
                <link
                    rel="stylesheet"
                    href={this.props.relPath ? this.props.relPath + "static/semantic.min.css" : "static/semantic.min.css"}
                />
                <link rel="stylesheet" href={this.props.relPath ? this.props.relPath + "static/style.css" : "static/style.css"} />
                <Container fluid>
                    <Menu fluid widths={1} size="massive">
                        <Menu.Item className="-header">golddigger.io</Menu.Item>
                    </Menu>
                </Container>
            </Fragment>
        );
    }
}
