import React, { Component } from "react";
import Layout from "../components/layout.jsx";


class Login extends Component {

    render() {
        return (
            <Layout>
            <div>
                <div className={"row"}>
                    <h1 className="ui header">goldigger.io Login</h1>
                </div>
                <div className={"row"}>
                    <div className={"three wide column"}>
                        <img className="ui small image" src="./de4022dd39fa43041188aa8e937b6153.jpg"/>
                    </div>
                    <div className={"ten wide column"}>
                        <form className="ui form">
                            <div className="field">
                                <label>E-Mail-Adresse</label>
                                <input type="text" name="first-name" placeholder="email"/>
                            </div>
                            <div className="field">
                                <label>Passwort</label>
                                <input type="text" name="last-name" placeholder="pword"/>
                            </div>
                            <button className="ui button" type="submit">Login</button>
                        </form>
                    </div>
                    <div className={"three wide column"}>
                        <img className="ui small image" src="./de4022dd39fa43041188aa8e937b6153.jpg"/>
                    </div>
                </div>
            </div>
            </Layout>
        );
    }
}

export default Login;
