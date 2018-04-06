import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Tab, Form, Button, Input, Container, Card } from "semantic-ui-react";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";
import FeedElementBig from "../components/FeedElementBig";
import EditProfile from "./EditProfile";
import Follower from "./Follower";
import Post from "./Post";
import Ansehen from "./Ansehen";


class FeaturedProfiles extends Component {
    state = { active: true, activeItem: "featured" };

    render() {
        return (
            <Fragment>
                <h1>!! The Top 9 Users right now !!</h1>
                <br />
                <br />
                <br />
                <Grid columns={3}>
                    <Grid.Row>
                        <Grid.Column>
                            <Button animated="fade" className="featured-user">
                                <Button.Content className="-visible">
                                    <Image fluid src="../static/bild.jpeg" className="-image" />
                                </Button.Content>
                                <Button.Content hidden>Geiler User</Button.Content>
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button animated="fade" className="featured-user">
                                <Button.Content className="-visible">
                                    <Image fluid src="../static/bild.jpeg" className="-image" />
                                </Button.Content>
                                <Button.Content hidden>Geiler User</Button.Content>
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button animated="fade" className="featured-user">
                                <Button.Content className="-visible">
                                    <Image fluid src="../static/bild.jpeg" className="-image" />
                                </Button.Content>
                                <Button.Content hidden>Geiler User</Button.Content>
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Button animated="fade" className="featured-user">
                                <Button.Content className="-visible">
                                    <Image fluid src="../static/bild.jpeg" className="-image" />
                                </Button.Content>
                                <Button.Content hidden>Geiler User</Button.Content>
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button animated="fade" className="featured-user">
                                <Button.Content className="-visible">
                                    <Image fluid src="../static/bild.jpeg" className="-image" />
                                </Button.Content>
                                <Button.Content hidden>Geiler User</Button.Content>
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button animated="fade" className="featured-user">
                                <Button.Content className="-visible">
                                    <Image fluid src="../static/bild.jpeg" className="-image" />
                                </Button.Content>
                                <Button.Content hidden>Geiler User</Button.Content>
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Button animated="fade" className="featured-user">
                                <Button.Content className="-visible">
                                    <Image fluid src="../static/bild.jpeg" className="-image" />
                                </Button.Content>
                                <Button.Content hidden>Geiler User</Button.Content>
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button animated="fade" className="featured-user">
                                <Button.Content className="-visible">
                                    <Image fluid src="../static/bild.jpeg" className="-image" />
                                </Button.Content>
                                <Button.Content hidden>Geiler User</Button.Content>
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button animated="fade" className="featured-user">
                                <Button.Content className="-visible">
                                    <Image fluid src="../static/bild.jpeg" className="-image" />
                                </Button.Content>
                                <Button.Content hidden>Geiler User</Button.Content>
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Fragment>
        );
    }
}

export default FeaturedProfiles;
