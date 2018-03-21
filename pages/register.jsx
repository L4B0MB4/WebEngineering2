import React, { Component } from "react";
import Layout from "../components/layout.jsx";

class Register extends Component {

    render() {
        return (
            <div>
                <Layout>
                    <form action={"/api/user/register"} method={"POST"}>
                        <label htmlFor={"name"}>Name: </label>
                        <input type="text" name="name" id={"name"} placeholder={"Name"}/>

                        <label htmlFor={"email"}>Email: </label>
                        <input type="text" name="email" id={"email"} placeholder={"E-Mail"}/>

                        <label htmlFor={"password"}>Passwort: </label>
                        <input type="text" name="password" id={"password"} placeholder={"Passwort"}/>

                        <button type="submit" value="Register" />
                    </form>
                </Layout>
            </div>
        );
    }
}

export default Register;
