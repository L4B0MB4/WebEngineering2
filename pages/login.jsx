import React, { Component } from "react";
import OwnHeader from "../components/Header.jsx";
import { Grid, Image, Button } from 'semantic-ui-react';
import Request from "../components/utils/request";
import {hash} from "../components/utils/utils"

const request = new Request();

class Login extends Component {

    handleLogin=async ()=>
    {
        let user=
        {
            password:this.state.pw,
            username:this.state.username
        }
        let res =await request.callLogin(user);
        if(res.data.type==="success")
        {
            window.location.replace("/");
        }

    }

    render() {
        return (
            <div>
            <OwnHeader/>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={5} />
                        <Grid.Column width={6}>
                            <div className="ui form loginform">
                                <div className="login-imgcontainer">
                                    <img src="/static/golddiggertext.png" alt="Avatar" className="avatar"/>
                                </div>
                                <div className="field">
                                    <label>E-Mail-Adresse</label>
                                    <div className="ui input">
                                        <input type="text" onChange={(e)=>this.setState({username:e.target.value})} name="username" placeholder="E-Mail" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="login-label" htmlFor="passwd">Passwort</label>
                                    <div className="ui input" >
                                        <input name="passwd" type="password" placeholder="Passwort" />
                                    <label >Privater Schlüssel | Passwort</label>
                                    <div className="ui input">
                                        <input name="password" onChange={(e)=>this.setState({pw:e.target.value})} type="password" placeholder="Privater Schlüssel" />
                                    </div>
                                </div>
                                <div className="ui center aligned page grid  login-btn-form">
                                    <button className="ui button login-btn" type="submit">Login</button>
                                    <span className="psw"><a href="#">Passwort vergessen?</a></span>
                                </div>
                                <div className="ui center aligned page grid">
                                    <span className=""><a href="#">Noch nicht registriert? Jetzt registrieren</a></span>
                                    <Button className="login-btn" onClick={this.handleLogin}>Login</Button>
                                </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column  width={5}/>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default Login;