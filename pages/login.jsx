import React, { Component } from "react";
<<<<<<< HEAD
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
=======
import Layout from "../components/layout.jsx";

class Login extends Component {

    render() {
        return (
            <div>
                <Layout>
                    <form action={"/api/user/login"} method={"POST"}>
                        <label htmlFor={"name"}>Name: </label>
                        <input type="text" name="name" id={"name"} placeholder={"Name"} ref={"name"} />

                        <label htmlFor={"password"}>Passwort: </label>
                        <input type="text" name="password" id={"password"} placeholder={"Passwort"} ref={"password"} />

                        <button type="submit" value="Login" />
                    </form>
                </Layout>
>>>>>>> 0dd4f948ed654c381aa877d829525bdb97c546c9
            </div>
        );
    }
}
<<<<<<< HEAD
=======

>>>>>>> 0dd4f948ed654c381aa877d829525bdb97c546c9
export default Login;
