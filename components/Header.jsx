import React, { Component, Fragment } from "react";
import { Menu, Container, Icon } from "semantic-ui-react";

export default class Header extends Component {
  render() {
    const { setOpenSidebar } = this.props;
    return (
      <Fragment>
        <title>Golddigger IO</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css " />
        <link rel="stylesheet" href={this.props.relPath ? this.props.relPath + "static/style.css" : "static/style.css"} />
        <Container fluid>
          <Menu fluid widths={1} size="massive">
            <Menu.Item className="-header">golddigger.io</Menu.Item>
          </Menu>
          {setOpenSidebar ? <Icon name="sidebar" onClick={() => setOpenSidebar(true)} className="-header-icon -clickable" /> : null}
        </Container>
      </Fragment>
    );
  }
}
