import React, { Component, Fragment } from "react";
import {
  Icon,
  Card,
  Label,
  Input,
  Menu,
  Header,
  Grid,
  Image
} from "semantic-ui-react";
import OwnHeader from "./Header";
import Link from "next/link";

class Layout extends Component {
  state = { activeItem: "feed" }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state;
    return (
      <Fragment>
        <OwnHeader />
        <Grid divided={false} celled="internally" className="own-grid">
          <Grid.Column width={3} stretched className="grid-column">
            <div className='-sidebars'>
              <Card>
                <Image src="../static/bild.jpeg" rounded />
                <Card.Content>
                  <Card.Header>Name</Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="ansehen" />
                    10 Ansehen
                  </a>
                </Card.Content>
              </Card>
              <Menu vertical floated fixed="bottom" tabular className="-menu">
                <Link prefetch href="\profil">
                  <Menu.Item
                    name="profil"
                    active={activeItem === "profil"}
                    onClick={this.handleItemClick}
                  >
                    Profil
                </Menu.Item>
                </Link>
                <Link prefetch href="\index">
                  <Menu.Item
                    name="feed"
                    active={activeItem === "feed"}
                    onClick={this.handleItemClick}
                  >
                    Feed
                </Menu.Item>
                </Link>
              </Menu>
            </div>
          </Grid.Column>

          <Grid.Column width={10} stretched className="grid-column" >
            <div className="-feed">
              {this.props.children}
            </div>
          </Grid.Column>

          <Grid.Column width={3} stretched className="grid-column">
            <div className='-sidebars'>
              <Menu pointing vertical className="-menu">
                <Menu.Item
                  name="impressum"
                  active={activeItem === "impressum"}
                  onClick={this.handleItemClick}
                >
                  Impressum
                </Menu.Item>
                <Menu.Item
                  name="kontakt"
                  active={activeItem === "kontakt"}
                  onClick={this.handleItemClick}
                >
                  Kontakt
                </Menu.Item>
              </Menu>
            </div>
          </Grid.Column>
        </Grid>
      </Fragment>
    );

  }
}

export default Layout;
