import React, { Component } from "react";
import OwnHeader from "../components/Header.jsx";


class Login extends Component {

    render() {
        return (
            <div>
            <OwnHeader/>
                <div class="row">
                    <div class="three wide column">
                        <img src="/assets/images/wireframe/image.png" class="ui image" />
                    </div>
                    <div class="ten wide column">
                        <form className="ui form">
                            <div className="field">
                                <label>E-Mail-Adresse</label>
                                <div class="ui input">
                                    <input type="text" placeholder="E-Mail" />
                                </div>
                            </div>
                            <div className="field">
                                <label>Passwort</label>
                                <div class="ui input">
                                    <input type="text" placeholder="Passwort" />
                                </div>
                            </div>
                            <button className="ui button" type="submit">Login</button>
                        </form>
                    </div>
                    <div class="three wide column">
                        <img src="/assets/images/wireframe/image.png" class="ui image" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
