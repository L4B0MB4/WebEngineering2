import React, { Component, Fragment } from "react";
import { Menu, Container } from "semantic-ui-react";

export default class Header extends Component {
  render() {
    return (
      <Fragment>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        />
        <link rel="stylesheet" href="static/style.css" />
        <Container fluid>
        <Menu fluid widths={1} size="massive" >
          <Menu.Item className="-header">golddigger.io</Menu.Item>
        </Menu>
       
        </Container>
      </Fragment>
    );
  }
}