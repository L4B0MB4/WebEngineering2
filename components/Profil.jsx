import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input } from "semantic-ui-react";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import FeedElement from "../components/FeedElement";

const panes = [
    {
        menuItem: "Your Follower",
        render: (props) => {
            const { followers, user } = props.props.props.props;
            return (
                <Tab.Pane className="-tab">
                    <div className="-padding-10 -full-width">
                        <Segment raised compact className="-full-width -segment">
                            <Item.Group>
                                {followers
                                    ? followers.map((follower) => {
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
                            <Pagination size="mini" siblingRange="0" boundaryRange="0" defaultActivePage={1} totalPages={10} />
                        </Segment>
                    </div>
                </Tab.Pane>
            );
        }
    },
    {
        menuItem: "Your Posts",
        render: (props) => {
            const { userContent, user } = props.props.props.props;
            return (
                <Tab.Pane className="-tab">
                    <div className="-padding-10 -full-width -posts">
                        <Segment raised compact className="-full-width -segment">
                            <Feed>
                                {userContent
                                    ? userContent.map((item) => {
                                          if (!user) return null;
                                          return (
                                              <FeedElement
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
                            <Pagination size="mini" siblingRange="0" boundaryRange="0" defaultActivePage={1} totalPages={4} />
                        </Segment>
                    </div>
                </Tab.Pane>
            );
        }
    },
    {
        menuItem: "Your Ansehen",
        render: (props) => {
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
        render: () => (
            <Tab.Pane className="-tab">
                <div className="-full-width -padding-10">
                    <Segment raised className="-full-width -segment">
                        <Form>
                            <Image src="../static/bild.jpeg" size="small" circular centered />
                            <br />
                            <Form.Field>
                                <label>Profile Picture</label>
                                <Input type="file" onChange={(e) => this.onSelectFiles(e.target.files)} className="upload" />
                            </Form.Field>
                            <Form.Field>
                                <label>Username</label>
                                <Input defaultValue="Name" />
                            </Form.Field>
                            <Button type="submit">Save changes</Button>
                        </Form>
                    </Segment>
                </div>
            </Tab.Pane>
        )
    }
];

const Tabs = (props) => <Tab panes={panes} props={{ props }} />;

class Profil extends Component {
    state = { active: true, activeItem: "profil" };

    render() {
        return (
            <Fragment>
                <h1>Your Profile</h1>
                <br />
                <br />
                <Tabs className="-tab" props={this.props} />
            </Fragment>
        );
    }
}

export default Profil;
