import React, { Component, Fragment } from "react";
import { Menu, Container, Icon, Popup, Button, Grid, Label } from "semantic-ui-react";
class Header extends Component {
  render() {
    const { setOpenSidebar, news } = this.props;
    return (
      <Fragment>
        <title>Golddigger IO</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css " />
        <link rel="stylesheet" href={this.props.relPath ? this.props.relPath + "static/style.css" : "static/style.css"} />
        <Container fluid>
          <Menu fluid widths={1} size="massive">
            <Menu.Item className="-header-menu">
              <Grid style={{ width: "inherit", height: "inherit" }}>
                <Grid.Column className="-no-padding" width="3" />
                <Grid.Column className="-no-padding" width="10">
                  <span className="-header">golddigger.io</span>
                </Grid.Column>
                <Grid.Column className="-no-padding -header-news " width="3" />
              </Grid>
            </Menu.Item>
          </Menu>
          {setOpenSidebar ? <Icon name="sidebar" onClick={() => setOpenSidebar(true)} className="-header-icon -clickable" /> : null}
        </Container>
      </Fragment>
    );
  }
}

export default Header;
