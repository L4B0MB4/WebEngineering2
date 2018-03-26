import React, { Component } from "react";
import OwnHeader from "../components/Header.jsx";
import { Grid, Image, Button, Form, Input, Label, Icon} from 'semantic-ui-react';
import Link from "next/link";
import Request from "../components/utils/request";
import {hash} from "../components/utils/utils"

const request = new Request();

class Login extends Component {

    handleLogin=async ()=>
    {
        let user=
        {
            password:hash(this.state.pw),
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

                            <Form className="-loginform">

                                <Image src="/static/golddiggertext.png" alt="Avatar" className="-avatar"/>

                                <Form.Field className="-login-field">
                                    <label className="-login-label">E-Mail-Adresse</label>
                                        <Input type="text" onChange={(e)=>this.setState({username:e.target.value})} name="username" placeholder="E-Mail" />
                                </Form.Field>

                                <Form.Field className="-login-field">
                                    <label htmlFor="password" className="-login-label" >Passwort</label>
                                    <Input name="password" onChange={(e)=>this.setState({pw:e.target.value})} type="password" placeholder="Passwort" />
                                </Form.Field>

                                <div className="ui center aligned page grid -login-btn-form">
                                    <Button className="-login-btn" onClick={this.handleLogin}>Login</Button>
                                    <span className="-psw"><a href="#">Passwort vergessen?</a></span>
                                    <span className="-reg-span"><Link prefetch href="/register"><a>Noch nicht registriert? Jetzt registrieren</a></Link></span>
                                </div>
                            </Form>
                        </Grid.Column>
                        <Grid.Column  width={5}/>
                    </Grid.Row>
                </Grid>
            </div>

        );
    }
}

export default Login;