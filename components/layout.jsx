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


  state = { active: true, activeItem: 'inbox' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render ()
  {
    const { activeItem, active } = this.state
    return(
      <div>
        <OwnHeader/>
          <Grid celled="internally" >
            <Grid.Column width={3} stretched className='-sidebars'> 
              <div>

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem, active } = this.state;
    return (
      <Fragment>
        <OwnHeader />
        <Grid celled="internally">
          <Grid.Column width={3} stretched style={{postion:"relative"}}>
            <div style={{position:"fixed",width:"inherit",padding:"inherit",margin:"inherit"}}>
              <Card>
                <Image src="/components/bild.jpeg" />
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
              <Menu pointing vertical>
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

            <Grid.Column width={10} ref={this.handleContextRef}>{this.props.children}</Grid.Column>

            <Grid.Column width={3} stretched className='-sidebars'>
                Footer
            </Grid.Column>
          </Grid>
        
      </div>
    )

          <Grid.Column width={10}>{this.props.children}</Grid.Column>

          <Grid.Column width={3}>Footer</Grid.Column>
        </Grid>
      </Fragment>
    );

  }
}

export default Layout;
