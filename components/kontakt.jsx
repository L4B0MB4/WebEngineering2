import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Button, Card } from "semantic-ui-react";
import OwnHeader from "../components/Header.jsx";
import Layout from "../components/layout.jsx";


var request;
class Kontakt extends Component {

    state = { activeItem: "kontakt" };

    render() {
        return (
            <Fragment>
                <h1>About us</h1>
                <br />
                <br />
                <br />
                <Card.Group centered itemsPerRow={2}>
                    <Card>
                        <Image src='../static/lars.jpeg' />
                        <Card.Content>
                            <Card.Header>Lars Bommersbach</Card.Header>
                            <Card.Meta>Joined in 2016</Card.Meta>
                            <Card.Description>Daniel is a comedian living in Nashville.</Card.Description>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Image src='../static/isi.jpg' size="large" />
                        <Card.Content>
                            <Card.Header>Isabel Staaden</Card.Header>
                            <Card.Meta>Frontend Makeup Specialist & Worldwide Women Ambassador</Card.Meta>
                            <Card.Description>Daniel is a comedian living in Nashville.</Card.Description>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Image src='../static/felix.jpg' />
                        <Card.Content>
                            <Card.Header>Prof. Dr. Med. Felix Waldbach</Card.Header>
                            <Card.Meta>Backend of Excellence Lead Engineer North America</Card.Meta>
                            <Card.Description>Dr. Waldbach is the leading Backend Engineer for all departments in North America.
                                He graduated in Applied Medicine and Super Human Science in 2012 but decided to switch to something bigger.
                                Today most people know him for his excellent contribution to global web applications like golddigger.io, wasgehtdigger.io and aufsmauldigga.io.</Card.Description>
                        </Card.Content>
                    </Card>

                    <Card>
                        <Image src='../static/tino.jpg' />
                        <Card.Content>
                            <Card.Header>Tino Metzger</Card.Header>
                            <Card.Meta>Joined in 2016</Card.Meta>
                            <Card.Description>Daniel is a comedian living in Nashville.</Card.Description>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </Fragment>
        );
    }
}

export default Kontakt;