import React, { Component, Fragment } from "react";
import { Icon, Card, Label, Input, Menu, Header, Grid, Image, List, Button, Modal, Sidebar, Segment, Container } from "semantic-ui-react";
import OwnHeader from "./Header";
import Link from "next/link";
import BlockchainWrapper from "../components/utils/BlockchainWrapper";
import onClickOutside from "react-onclickoutside";

class Layout extends Component {
  state = { openSidebar: false };
  searchValue = "";

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

  handleClickOutside = () => {
    this.setOpenSidebar(false);
  };
  Search = async e => {
    if (e.key === "Enter") {
      if (this.props.request) {
        const { data } = await this.props.request.callGetUserByUsername(this.searchValue);
        if (data[0] && data[0].name) {
          window.location = "./v_" + data[0].name;
        } else {
          this.setState({ showError: true, errorMessage: "Couldn´t find User" });
          window.setTimeout(() => this.setState({ showError: false }), 2000);
        }
      }
    }
  };

  errorDialog = () => {
    if (this.state.showError)
      return (
        <Card
          style={{
            backgroundColor: "#e54747",
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: "10000"
          }}>
          <Card.Content>
            <Card.Header style={{ color: "whitesmoke" }}>ERROR</Card.Header>
            <Card.Description style={{ color: "whitesmoke" }}>{this.state.errorMessage}</Card.Description>
            <Card.Content extra>
              <br />
              <Button onClick={() => this.setState({ showError: false })}>Schließen</Button>
            </Card.Content>
          </Card.Content>
        </Card>
      );
  };

  render() {
    const { user, activeItem, isUnconnected } = this.props;
    return (
      <Fragment>
        <Grid divided={false} celled="internally">
          <Grid.Row only="tablet computer">
            <OwnHeader />
            {this.leftSide()}
            {this.errorDialog()}
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
            <Sidebar.Pushable as={"div"} className="-full-width -sidebar">
              <Sidebar
                id="mobile-menu"
                as={Menu}
                animation="overlay"
                width="thin"
                visible={this.state.openSidebar}
                direction="right"
                icon="labeled"
                vertical
                inverted
                className="mobile-menu">
                <Link href={"./profile"}>
                  <Menu.Item name="profil">
                    <Icon name="user" />Profile
                  </Menu.Item>
                </Link>
                <Link href={"./"}>
                  <Menu.Item name="feed">
                    <Icon name="newspaper" />Feed
                  </Menu.Item>
                </Link>
                <Link href={"./featured"}>
                  <Menu.Item name="featured">
                    <Icon name="trophy" />Featured Profiles
                  </Menu.Item>
                </Link>
                <Link href={"./aboutus"}>
                  <Menu.Item name="kontakt">
                    <Icon name="hand victory" />About us
                  </Menu.Item>
                </Link>
                <Link href={"./impressum"}>
                  <Menu.Item name="impressum">
                    <Icon name="legal" />Disclaimer
                  </Menu.Item>
                </Link>
                <Menu.Item name="delete" className="-clickable" onClick={() => this.setOpenSidebar(false)}>
                  <Icon name="delete" />
                  Close
                </Menu.Item>
                <Link href={"./logout"}>
                  <Menu.Item name="logout">
                    <Icon name="power" />Logout
                  </Menu.Item>
                </Link>
              </Sidebar>
              <Sidebar.Pusher>
                <OwnHeader setOpenSidebar={this.setOpenSidebar} />
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
    const { user, activeItem } = this.props;
    return (
      <Grid.Column width={3} stretched className="grid-column">
        <div className="-sidebars">
          <Card>
            <div className="-square">
              <img src={user && user.profilePicture ? "/api/picture/" + user.profilePicture : "../static/bild.jpeg"} className="-content" />
            </div>
            <Card.Content>
              <Card.Header>{user ? user.name : ""}</Card.Header>
            </Card.Content>
            <Card.Content extra>
              <p>
                <Icon name="trophy" />
                {user ? user.ansehen : ""} k
              </p>
            </Card.Content>
          </Card>
          <Menu vertical floated fixed="bottom" tabular className="-menu">
            <Link href={"./profile"}>
              <Menu.Item name="profile" active={activeItem === "profile"}>
                <Icon name="user" />Profile
              </Menu.Item>
            </Link>
            <Link href={"./"}>
              <Menu.Item name="feed" active={activeItem === "feed"}>
                <Icon name="newspaper" />Feed
              </Menu.Item>
            </Link>
            <Link href={"./featured"}>
              <Menu.Item name="featured" active={activeItem === "featured"}>
                <Icon name="trophy" />Featured Profiles
              </Menu.Item>
            </Link>
            <Link href={"./logout"}>
              <Menu.Item name="logout" active={activeItem === "logout"}>
                <Icon name="power" />Logout
              </Menu.Item>
            </Link>
            <Menu.Item>
              <Input icon="search" placeholder="Search..." onChange={e => (this.searchValue = e.target.value)} onKeyPress={this.Search} />
            </Menu.Item>
          </Menu>
        </div>
      </Grid.Column>
    );
  };
  rightSide = () => {
    const { user, activeItem } = this.props;
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
            <Link href={"./aboutus"}>
              <List.Item>
                <Button compact as="a" size="big" className="list-item" name="kontakt" active={activeItem === "kontakt"}>
                  <Icon name="mail" />About us
                </Button>
              </List.Item>
            </Link>
            <Link href={"./impressum"}>
              <List.Item>
                <Button compact as="a" size="big" className="list-item" name="impressum" active={activeItem === "impressum"}>
                  <Icon name="registered" />Disclaimer
                </Button>
              </List.Item>
            </Link>
          </List>
        </div>
      </Grid.Column>
    );
  };
}

export default onClickOutside(Layout);
