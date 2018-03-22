import React, { Component } from "react";
import OwnHeader from "../components/Header.jsx";
import { Grid, Image } from 'semantic-ui-react';

class Login extends Component {
    render() {
        return (
            <div>
            <OwnHeader/>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={5}>

                        </Grid.Column>
                        <Grid.Column width={6}>
                            <form className="ui form loginform">
                                <div className="login-imgcontainer">
                                    <img src="/static/golddiggertext.png" alt="Avatar" className="avatar"/>
                                </div>
                                <div className="field">
                                    <label>E-Mail-Adresse</label>
                                    <div className="ui input">
                                        <input type="text" placeholder="E-Mail" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="login-label" htmlFor="passwd">Passwort</label>
                                    <div className="ui input" >
                                        <input name="passwd" type="password" placeholder="Passwort" />
                                    </div>
                                </div>
                                <div className="ui center aligned page grid  login-btn-form">
                                    <button className="ui button login-btn" type="submit">Login</button>
                                    <span className="psw"><a href="#">Passwort vergessen?</a></span>
                                </div>
                                <div className="ui center aligned page grid">
                                    <span className=""><a href="#">Noch nicht registriert? Jetzt registrieren</a></span>
                                </div>
                            </form>
                        </Grid.Column>
                        <Grid.Column  width={5}>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default Login;