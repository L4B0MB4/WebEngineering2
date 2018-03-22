import React, { Component, Fragment } from "react";
import {
  Icon,
  Card,
  Label,
  Input,
  Menu,
  Header,
  Grid,
  Image,
  Sticky,
  Segment
} from "semantic-ui-react";
//import ".././static/style.css"
import OwnHeader from "./Header";

class Layout extends Component {
  state = { active: true, activeItem: "inbox" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    const { activeItem, active } = this.state;
    return (
      <Fragment>
        <OwnHeader />
        <Grid celled="internally">
          <Grid.Column width={3} stretched style={{ postion: "relative", margin: 0, padding: 0 }} >
            <div className='left-sidebar' style={{ position: "fixed", width: "inherit", margin: "inherit", padding: "20px" }}>
              <Card>
                <Image src="../static/bild.jpeg" />
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
              <Menu pointing secondary vertical fluid className="-menu"
              style={{ position: "fixed", width: "inherit", margin: "inherit", padding: "0" }}>
                <Menu.Item
                  name="profil"
                  active={activeItem === "profil"}
                  onClick={this.handleItemClick}
                >
                  Profil
                </Menu.Item>
                <Menu.Item
                  name="feed"
                  active={activeItem === "feed"}
                  onClick={this.handleItemClick}
                >
                  Feed
                </Menu.Item>
              </Menu>
            </div>
          </Grid.Column>
          <Grid.Column width={10} style={{ postion: "relative", margin: 0, padding: 0 }} >
            <div style={{ margin: "inherit", padding: "30px" }}>
              {this.props.children}
            </div>
          </Grid.Column>

          <Grid.Column width={3} stretched style={{ postion: "relative", margin: 0, padding: 0 }} >
            <div className='right-sidebar' style={{ position: "fixed", width: "inherit", margin: "inherit", padding: "20px" }}>
              <Menu pointing vertical fluid className="-menu">
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
