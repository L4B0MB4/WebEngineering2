import React, { Component, Fragment } from "react";
import { Icon, Card, Label, Input, Menu, Header, Grid, Image, List, Button, Modal, Sidebar, Segment, Container } from "semantic-ui-react";
import OwnHeader from "./Header";
import Link from "next/link";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";

class Layout extends Component {
  state = { activeItem: "feed", openSidebar: false };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    this.props.handleItemClick(name);
    this.setOpenSidebar(false);
  };

  isReadyToMine = () => {
    if (this.props.blockchainWrapper) {
      this.setState({ isReadyToMine: true });
    }
  };

  componentWillMount() {
    this.isReadyToMine();
  }

  setOpenSidebar = bool => {
    this.setState({ openSidebar: bool });
  };

  render() {
    const { activeItem } = this.state;
    const { user } = this.props;
    return (
      <Fragment>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Grid divided={false} celled="internally">
          <Grid.Row only="tablet computer">
            <OwnHeader relPath={this.props.relPath} />
            {this.leftSide()}
            <Grid.Column width={10} stretched className="grid-column">
              <Grid>
                <Grid.Column width={1} />
                <Grid.Column computer={14}>
                  <div className="-feed">{this.props.children}</div>
                </Grid.Column>
                <Grid.Column width={1} />
              </Grid>
            </Grid.Column>
            {this.rightSide()}
          </Grid.Row>
          <Grid.Row only="mobile">
            <Sidebar.Pushable as={"div"} className="-full-width">
              <Sidebar
                as={Menu}
                animation="overlay"
                width="thin"
                visible={this.state.openSidebar}
                direction="right"
                icon="labeled"
                vertical
                inverted>
                <Menu.Item name="profil" onClick={this.handleItemClick}>
                  <Icon name="user" />Profile
                </Menu.Item>
                <Menu.Item name="feed" onClick={this.handleItemClick}>
                  <Icon name="newspaper" />Feed
                </Menu.Item>
                <Menu.Item name="featured" onClick={this.handleItemClick}>
                  <Icon name="trophy" />Featured Profiles
                </Menu.Item>
                <Menu.Item name="logout" onClick={this.handleItemClick}>
                  <Icon name="power" />Logout
                </Menu.Item>
                <Menu.Item name="kontakt" onClick={this.handleItemClick}>
                  <Icon name="hand victory" />About us
                </Menu.Item>
                <Menu.Item name="impressum" onClick={this.handleItemClick}>
                  <Icon name="legal" />Disclaimer
                </Menu.Item>
                <Menu.Item name="logout" onClick={this.handleItemClick}>
                  <Icon name="power" />Logout
                </Menu.Item>
                <Menu.Item name="delete" className="-clickable" onClick={() => this.setOpenSidebar(false)}>
                  <Icon name="delete" />
                  Close
                </Menu.Item>
              </Sidebar>
              <Sidebar.Pusher>
                <OwnHeader relPath={this.props.relPath} setOpenSidebar={this.setOpenSidebar} />
                <Grid>
                  <Grid.Column width={16} style={{ marginLeft: "10px", marginRight: "10px" }}>
                    <div className="-feed" style={{ minHeight: "500px" }}>
                      {this.props.children}
                    </div>
                  </Grid.Column>
                </Grid>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </Grid.Row>
        </Grid>
      </Fragment>
    );
  }

  leftSide = () => {
    const { activeItem } = this.state;
    const { user } = this.props;
    return (
      <Grid.Column width={3} stretched className="grid-column">
        <div className="-sidebars">
          <Card>
            <Image src={user && user.profilePicture ? "/api/picture/" + user.profilePicture : "../static/bild.jpeg"} rounded />
            <Card.Content>
              <Card.Header>{user ? user.name : ""}</Card.Header>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name="users" />
                {user ? user.ansehen : ""}
              </a>
            </Card.Content>
          </Card>
          <Menu vertical floated fixed="bottom" tabular className="-menu">
            <Menu.Item name="profil" active={activeItem === "profil"} onClick={this.handleItemClick}>
              <Icon name="user" />Profile
            </Menu.Item>
            <Menu.Item name="feed" active={activeItem === "feed"} onClick={this.handleItemClick}>
              <Icon name="newspaper" />Feed
            </Menu.Item>
            <Menu.Item name="featured" active={activeItem === "featured"} onClick={this.handleItemClick}>
              <Icon name="trophy" />Featured Profiles
            </Menu.Item>
            <Menu.Item name="logout" active={activeItem === "logout"} onClick={this.handleItemClick}>
              <Icon name="power" />Logout
            </Menu.Item>
            <Menu.Item>
              <Input icon="search" placeholder="Search..." />
            </Menu.Item>
          </Menu>
        </div>
      </Grid.Column>
    );
  };
  rightSide = () => {
    const { activeItem } = this.state;
    const { user } = this.props;
    return (
      <Grid.Column width={3} stretched className="grid-column">
        <div className="-sidebars">
          <List relaxed className="obere-list">
            <List.Item>
              <Button id="mine" as="a" size="big" className="mine-button" disabled={!this.state.isReadyToMine}>
                <Icon name="diamond" />Ready to mine
              </Button>
            </List.Item>
          </List>
          <List relaxed className="-list">
            <List.Item>
              <Button
                compact
                as="a"
                size="big"
                className="list-item"
                name="kontakt"
                active={activeItem === "kontakt"}
                onClick={this.handleItemClick}>
                <Icon name="hand victory" />About us
              </Button>
            </List.Item>
            <List.Item>
              <Button
                compact
                as="a"
                size="big"
                className="list-item"
                name="impressum"
                active={activeItem === "impressum"}
                onClick={this.handleItemClick}>
                <Icon name="legal" />Disclaimer
              </Button>
            </List.Item>
          </List>
        </div>
      </Grid.Column>
    );
  };
}

export default Layout;
