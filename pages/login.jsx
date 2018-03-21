import React, { Component } from "react";
import OwnHeader from "../components/Header.jsx";


class Login extends Component {

    render() {
        return (
            <div>
            <OwnHeader/>
                <div className="row">
                    <div className="three wide column">
                        <img src="/assets/images/wireframe/image.png" className="ui image" />
                    </div>
                    <div className="ten wide column">
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
                                    <input type="text" placeholder="Passwort" />
                                </div>
                            </div>
                            <button className="ui button" type="submit">Login</button>
                        </form>
                    </div>
                    <div className="three wide column">
                        <img src="/assets/images/wireframe/image.png" className="ui image" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
