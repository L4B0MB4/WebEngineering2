import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input } from "semantic-ui-react";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import FeedElementBig from "../components/FeedElementBig";
import EditProfile from "./EditProfile";

const panes = [
  {
    menuItem: "Your Follower",
    render: props => {
      const { followers, user } = props.props.props.props;
      return (
        <Tab.Pane className="-tab">
          <div className="-padding-10 -full-width">
            <Segment raised compact className="-full-width -segment">
              <Item.Group>
                {followers
                  ? followers.map(follower => {
                      if (!follower.user) return null;
                      return (
                        <Item key={follower.user.name}>
                          <Item.Image size="tiny" src="../static/bild.jpeg" />
                          <Item.Content verticalAlign="middle">
                            <Item.Header>{follower.user.name}</Item.Header>
                          </Item.Content>
                        </Item>
                      );
                    })
                  : null}
              </Item.Group>
            </Segment>
          </div>
        </Tab.Pane>
      );
    }
  },
  {
    menuItem: "Your Posts",
    render: props => {
      const { userContent, user } = props.props.props.props;
      return (
        <Tab.Pane className="-tab">
          <div className="-padding-10 -full-width -posts">
            <Segment raised compact className="-full-width -segment">
              <Feed>
                {userContent
                  ? userContent.map(item => {
                      if (!user) return null;
                      return (
                        <FeedElementBig
                          item={item}
                          user={user}
                          handleShare={undefined}
                          handleLike={undefined}
                          request={undefined}
                          key={item.timestamp}
                        />
                      );
                    })
                  : null}
              </Feed>
            </Segment>
          </div>
        </Tab.Pane>
      );
    }
  },
  {
    menuItem: "Your Ansehen",
    render: props => {
      const { userContent, user } = props.props.props.props;
      return (
        <Tab.Pane className="-tab">
          <div className="-full-width -padding-10">
            <Segment raised className="-full-width -segment">
              <Label as="a">
                <Image avatar spaced="right" src="../static/bild.jpeg" />
                Apple, 3
              </Label>
              <Label as="a">
                <Image avatar spaced="right" src="../static/bild.jpeg" />
                Nike, 2
              </Label>
              <Label as="a">
                <Image avatar spaced="right" src="../static/bild.jpeg" />
                Reebok, 1
              </Label>
              <Label as="a">
                <Image avatar spaced="right" src="../static/bild.jpeg" />
                Gucci, 4
              </Label>
            </Segment>
          </div>
        </Tab.Pane>
      );
    }
  },
  {
    menuItem: "Edit Profile",
    render: () => <EditProfile />
  }
];

const Tabs = props => <Tab panes={panes} props={{ props }} />;

class Profil extends Component {
  state = { active: true, activeItem: "profil" };

  render() {
    return (
      <div>
        <h1>Your Profile</h1>
        <br />
        <br />
        <Tabs className="-tab" props={this.props} />
      </div>
    );
  }
}

export default Profil;
