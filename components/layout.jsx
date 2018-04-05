import React, { Component, Fragment } from "react";
import { Icon, Card, Label, Input, Menu, Header, Grid, Image, List, Button, Modal } from "semantic-ui-react";
import OwnHeader from "./Header";
import Link from "next/link";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";

class Layout extends Component {
  state = { activeItem: "feed" };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    this.props.handleItemClick(name);
  };

  isReadyToMine = () => {
    if (this.props.blockchainWrapper) {
      this.setState({ isReadyToMine: true });
    }
  };

  componentWillMount() {
    this.isReadyToMine();
  }

  render() {
    const { activeItem } = this.state;
    const { user } = this.props;
    return (
      <Fragment>
        <OwnHeader relPath={this.props.relPath} />
        <Grid divided={false} celled="internally">
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
                <Menu.Item name="logout" active={activeItem === "logout"} onClick={this.handleItemClick}>
                  <Icon name="power" />Logout
                </Menu.Item>
                <Menu.Item>
                  <Input icon="search" placeholder="Search..." />
                </Menu.Item>
              </Menu>
            </div>
          </Grid.Column>

          <Grid.Column width={10} stretched className="grid-column">
            <Grid>
              <Grid.Column only="computer" width={1} />
              <Grid.Column mobile={16} mobile={16} computer={14} widescreen={10}>
                <div className="-feed">{this.props.children}</div>
              </Grid.Column>
              <Grid.Column only="computer" width={1} />
            </Grid>
          </Grid.Column>

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
                    <Icon name="mail" />About us
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
                    <Icon name="registered" />Disclaimer
                  </Button>
                </List.Item>
              </List>
            </div>
          </Grid.Column>
        </Grid>
      </Fragment>
    );
  }
}

export default Layout;
