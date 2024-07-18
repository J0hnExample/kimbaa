import React, {Component} from "react";
import { connect } from "react-redux";
import logger from "../logging/logger";

import * as navActions from '../actions/NavActions';
import * as authActions from '../actions/AuthActions';
import { bindActionCreators } from "redux";

import Button from "react-bootstrap/Button";

const mapStateToProps = state => {
    return state;
}

class LandingDemo extends Component{
    constructor(props){
        super(props);

        this.state = {
            matrikel: "",
            password: "",
            loginState: "idle",
        }

        this.doLogin = this.doLogin.bind(this);
        this.getRegistrationForm = this.getRegistrationForm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount(){
        logger.info("LoginPage.js mounted!");
    }

    doLogin(){
        const { matrikel, password } = this.state;
        const { loginAction } = this.props;
        loginAction(matrikel, password);
        this.setState({loginState: "waiting"});
        setTimeout(() => {
            this.setState({ loginState: "failed" });
        }, 2000);
    }

    handleInputChange(e){
        const { name, value } = e.target;
        this.setState({
            [name]: value,
            loginState: "idle",
        });
    }

    getRegistrationForm(){
        const { moveToRegister } = this.props;
        moveToRegister();
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.doLogin();
        }
    }

    render(){
        let loginMessage;
        switch(this.state.loginState){
            case "idle":
                loginMessage = <></>;
                break;
            case "waiting":
                loginMessage = <p className="blue shiftRight">Login wird verarbeitet...</p>;
                break;
            case "failed":
                loginMessage = <p className="red shiftRight">Login fehlgeschlagen!</p>;
                break;
            default:
                loginMessage = <></>;
                break;
        }
        return(
            <>
                <style>
                    {`
                        .blue{
                            color: #004282;
                        }
                        .red{
                            color: #ea3b07;
                        }
                        .shiftRight{
                            padding-left: 1vw;
                        }
                        .standardButton{
                            width: calc(35vw + 5px);
                        }
                        .loginField{
                            width: 35vw;
                            height: 26px;
                            border-radius: 10px;
                            border: 0;
                            margin-top: 10px;
                        }
                        .linkStyleButton{
                            font-size: 18px;
                        }
                    `}
                </style>
                <div className="formPage" onKeyDown={this.handleKeyPress}>
                    <div className="fAlignmentHelp">
                        <h1>Willkommen bei kimbaa!</h1>
                        <h2>Melde dich an, um deine Sitzung fortzusetzen.</h2>
                        <div className="fBody">
                            <h2>Login:</h2>
                                <input className="loginField" type="number" name="matrikel" value={this.state.matrikel} placeholder="Matrikelnr." onChange={this.handleInputChange}/>
                                <input className="loginField" type="password" name="password"value={this.state.password} placeholder="Passwort" onChange={this.handleInputChange}/>
                                <div>
                                    <button onClick={this.getRegistrationForm} className="linkStyleButton red"><u>Registrieren</u></button>
                                </div>
                                {loginMessage}
                                <Button type="submit" onClick={this.doLogin} className="standardButton">Anmelden</Button>
                        </div>
                    </div>
                    <img alt="kimbaa_login_logo" src="kimbaa_high_login.png"/>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    moveToRegister: navActions.getNavRegistrationPageAction,
    loginAction: authActions.loginAction
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LandingDemo);