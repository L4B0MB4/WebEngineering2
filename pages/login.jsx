import React, { Component } from "react";
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
            </div>
        );
    }
}

export default Login;
