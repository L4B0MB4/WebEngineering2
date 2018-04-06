import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input, Container } from "semantic-ui-react";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import FeedElementBig from "../components/FeedElementBig";
import EditProfile from "./EditProfile";
import Follower from "./Follower";
import Post from "./Post";
import Ansehen from "./Ansehen";

const panes = [
  {
    menuItem: "Followers",
    render: () => <Follower />
  },
  {
    menuItem: "Posts",
    render: () => <Post />
  },
  {
    menuItem: "Ansehen",
    render: () => <Ansehen />
  },
  {
    menuItem: "Edit Profile",
    render: () => <EditProfile />
  }
];

class Profil extends Component {
  state = { active: true, activeItem: "profil" };

  render() {
    return (
      <div>
        <h1>Your Profile</h1>
        <br />
        <br />
        <Tab className="-tab" panes={panes} props={this.props} />
      </div>
    );
  }
}

export default Profil;
