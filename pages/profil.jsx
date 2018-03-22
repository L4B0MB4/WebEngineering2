import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label } from "semantic-ui-react";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";


class Profil extends Component{

    state = { active: true, activeItem : "profil"};

    render(){
        return(
            <Fragment>
                <Layout>
                    <h1>Dein Profil</h1>
                    <div className="-follower">
                        <h3>Deine Follower</h3>
                        <Segment raised compact className="-segment">
                            <Item.Group>
                                <Item>
                                    <Item.Image size='tiny' src='../static/bild.jpeg' />
                                    <Item.Content verticalAlign='middle'>
                                        <Item.Header>Tino Metzger</Item.Header>
                                    </Item.Content>
                                </Item>
                                <Item>
                                    <Item.Image size='tiny' src='../static/bild.jpeg' />
                                    <Item.Content verticalAlign='middle'>
                                        <Item.Header>Felix Waldbach</Item.Header>
                                    </Item.Content>
                                </Item>
                                <Item>
                                    <Item.Image size='tiny' src='../static/bild.jpeg' />
                                    <Item.Content verticalAlign='middle'>
                                        <Item.Header>Lars Bommersbach</Item.Header>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                        </Segment>
                    </div>
                    <div className="-posts">
                        <h3>Deine Posts</h3>
                        <Segment raised compact className="-segment">
                            <Feed>
                                <Feed.Event>
                                    <Feed.Label>
                                        <img src='../static/bild.jpeg' />
                                    </Feed.Label>
                                    <Feed.Content>
                                        <Feed.Summary>
                                            You added <Feed.User>Lars Bommersbach</Feed.User>  as a friend
                                            <Feed.Date>1 Hour Ago</Feed.Date>
                                        </Feed.Summary>
                                        <Feed.Meta>
                                            <Feed.Like>
                                                <Icon name='like' />4 Likes
                                            </Feed.Like>
                                        </Feed.Meta>
                                    </Feed.Content>
                                </Feed.Event>
                                <Feed.Event>
                                    <Feed.Label image='../static/bild.jpeg' />
                                    <Feed.Content>
                                        <Feed.Summary>
                                            <a>You</a> added <a>2 new illustrations</a>
                                            <Feed.Date>4 days ago</Feed.Date>
                                        </Feed.Summary>
                                        <Feed.Extra images>
                                            <a><img src='../static/bild.jpeg' /></a>
                                            <a><img src='../static/bild.jpeg' /></a>
                                        </Feed.Extra>
                                        <Feed.Meta>
                                            <Feed.Like>
                                                <Icon name='like' />1 Like
                                            </Feed.Like>
                                        </Feed.Meta>
                                    </Feed.Content>
                                </Feed.Event>
                                <Feed.Event>
                                    <Feed.Label image='../static/bild.jpeg' />
                                    <Feed.Content>
                                        <Feed.Summary>
                                            You added <Feed.User>Tino Metzger</Feed.User>  as a friend
                                            <Feed.Date>2 Days Ago</Feed.Date>
                                        </Feed.Summary>
                                        <Feed.Meta>
                                            <Feed.Like>
                                                <Icon name='like' />8 Likes
                                            </Feed.Like>
                                        </Feed.Meta>
                                    </Feed.Content>
                                </Feed.Event>
                            </Feed>
                        </Segment>
                    </div>

                    <div className="-ansehen">
                        <h3>Dein Ansehen</h3>
                        <Segment raised className="-segment">
                            <Label as='a'>
                                <Image avatar spaced='right' src='../static/bild.jpeg' />
                                Apple, 3
                            </Label>
                            <Label as='a'>
                                <Image avatar spaced='right' src='../static/bild.jpeg' />
                                Nike, 2
                            </Label>
                            <Label as='a'>
                                <Image avatar spaced='right' src='../static/bild.jpeg' />
                                Reebok, 1
                            </Label>
                            <Label as='a'>
                                <Image avatar spaced='right' src='../static/bild.jpeg' />
                                Gucci, 4
                            </Label>
                        </Segment>
                    </div>
                </Layout>
            </Fragment>
        )
    }
}

export default Profil;