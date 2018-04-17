import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input, Container, Card } from "semantic-ui-react";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import FeedElementBig from "../components/FeedElementBig";
import Request from "../components/utils/request";
const request = new Request();

class FeaturedProfiles extends Component {
  render() {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return (
      <Layout activeItem="featured">
        <h1>!! The Top 12 Users right now !!</h1>
        <br />
        <br />
        <br />
        <Grid>
          <Grid.Row only="tablet computer" columns={3} textAlign="center">
            {arr.map(i => (
              <Grid.Column>
                <Button animated="fade" className="featured-user">
                  <Button.Content className="-visible">
                    <Image fluid src="../static/bild.jpeg" className="-image" />
                  </Button.Content>
                  <Button.Content hidden>Geiler User</Button.Content>
                </Button>
              </Grid.Column>
            ))}
          </Grid.Row>
          <Grid.Row only="mobile" columns={2} textAlign="center">
            {arr.map(i => (
              <Grid.Column>
                <Button animated="fade" className="featured-user">
                  <Button.Content className="-visible">
                    <Image fluid src="../static/bild.jpeg" className="-image" />
                  </Button.Content>
                  <Button.Content hidden>Geiler User</Button.Content>
                </Button>
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default FeaturedProfiles;
