import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input } from "semantic-ui-react";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";


const panes = [
  {
    menuItem: 'Your Follower', render: () => <Tab.Pane className="-tab">
      <div className="-padding-10 -full-width">
        <Segment raised compact className="-full-width -segment">
          <Item.Group>
            <Item>
              <Item.Image size="tiny" src="../static/bild.jpeg" />
              <Item.Content verticalAlign="middle">
                <Item.Header>Tino Metzger</Item.Header>
              </Item.Content>
            </Item>
            <Item>
              <Item.Image size="tiny" src="../static/bild.jpeg" />
              <Item.Content verticalAlign="middle">
                <Item.Header>Felix Waldbach</Item.Header>
              </Item.Content>
            </Item>
            <Item>
              <Item.Image size="tiny" src="../static/bild.jpeg" />
              <Item.Content verticalAlign="middle">
                <Item.Header>Lars Bommersbach</Item.Header>
              </Item.Content>
            </Item>
          </Item.Group>
          <Pagination size="mini" siblingRange="0" boundaryRange="0" defaultActivePage={1} totalPages={10} />
        </Segment>
      </div>
    </Tab.Pane>
  },
  {
    menuItem: 'Your Posts', render: () => <Tab.Pane className="-tab">
      <div className="-padding-10 -full-width -posts">
        <Segment raised compact className="-full-width -segment">
          <Feed>
            <Feed.Event>
              <Feed.Label image="../static/bild.jpeg" />
              <Feed.Content>
                <Feed.Summary>
                  <a>You</a> added <a>2 new illustrations</a>
                  <Feed.Date>4 days ago</Feed.Date>
                </Feed.Summary>
                <Feed.Extra images>
                  <a>
                    <img src="../static/bild.jpeg" />
                  </a>
                  <a>
                    <img src="../static/bild.jpeg" />
                  </a>
                </Feed.Extra>
                <Feed.Meta>
                  <Feed.Like>
                    <Icon name="like" />1 Like
                          </Feed.Like>
                </Feed.Meta>
              </Feed.Content>
            </Feed.Event>
          </Feed>
          <Pagination size="mini" siblingRange="0" boundaryRange="0" defaultActivePage={1} totalPages={4} />
        </Segment>
      </div>
    </Tab.Pane>
  },
  {
    menuItem: 'Your Ansehen', render: () => <Tab.Pane className="-tab">
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
  },
  {
    menuItem: 'Edit Profile', render: () => <Tab.Pane className="-tab">
      <div className="-full-width -padding-10">
        <Segment raised className="-full-width -segment">
          <Form>
            <Image src="../static/bild.jpeg" size="small" circular centered />
            <br />
            <Form.Field>
              <label>Profile Picture</label>
              <Input type="file" onChange={e => this.onSelectFiles(e.target.files)} className="upload" />
            </Form.Field>
            <Form.Field>
              <label>Username</label>
              <Input defaultValue="Name" />
            </Form.Field>
            <Button type='submit'>Save changes</Button>
          </Form>
        </Segment>
      </div>
    </Tab.Pane>
  },
]

const Tabs = () => (
  <Tab panes={panes} />
)

class Profil extends Component {
  state = { active: true, activeItem: "profil" };


  render() {
    return (
      <Fragment>
        <h1>Your Profile</h1>
        <br />
        <br />
        <Tabs className="-tab" />
      </Fragment>
    );
  }
}

export default Profil;
