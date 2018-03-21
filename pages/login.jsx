import React, { Component } from "react";
import OwnHeader from "../components/Header.jsx";
import { Grid, Image } from 'semantic-ui-react';

class Login extends Component {
    render() {
        return (
            <div>
            <OwnHeader/>
                <Grid celled>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Image src="/static/picture.jpg" />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <form className="ui form">
                                <div className="field">
                                    <label>E-Mail-Adresse</label>
                                    <div className="ui input">
                                        <input type="text" placeholder="E-Mail" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Passwort</label>
                                    <div className="ui input">
                                        <input type="password" placeholder="Passwort" />
                                    </div>
                                </div>
                                <button className="ui button" type="submit">Login</button>
                            </form>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Image src="/static/picture.jpg" />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
export default Login;
