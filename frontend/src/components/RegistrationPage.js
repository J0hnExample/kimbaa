import React, {Component} from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import logger from "../logging/logger";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import * as navActions from '../actions/NavActions';
import * as authActions from '../actions/AuthActions';

const mapStateToProps = state => {
    return { 
        userExistsError: state.auth.userAlreadyExists 
    }
}

class RegistrationPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            regMatrikel: "",
            regName: "",
            regEmail: "",
            regAdmin: false,
            regPassword: "",
            regPasswordRe: "",
            noMatch: false,
            incorrectEmailFormat: false,
            incorrectSIDFormat: false,
            incompleteForm: false,
        }

        this.handleCancel = this.handleCancel.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.checkEmail = this.checkEmail.bind(this);
        this.checkSID = this.checkSID.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    componentDidMount(){
        logger.info("RegistrationPage.js mounted!");
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.handleRegistration(e);
        }
    }

    handleCancel(e){
        const { close } = this.props;
        close();
    }

    handleCheck(e){
        const { name, checked } = e.target;
        this.setState({[name]: checked});
    }

    handleInputChange(e){
        const { name, value } = e.target;
        if(name === "regPassword" || name === "regPasswordRe"){
            this.setState(prevState => ({
                [name]: value,
                noMatch: false
            }));
        }else if(name === "regEmail"){
            this.setState(prevState => ({
                [name]: value,
                incorrectEmailFormat: false,
            }));
        }else if(name === "regMatrikel"){
            this.setState(prevState => ({
                [name]: value,
                incorrectSIDFormat: false,
            }))
        }else{
            this.setState({[name]: value});
        }
        this.setState({incompleteForm: false});
    }

    checkEmail(email){
        const suffix = '@bht-berlin.de';
        return email.endsWith(suffix);
    }
    checkSID(input) {
        const regex = /^\d{6}$/;
        return regex.test(input);
    }
    

    handleRegistration(e){
        let hasFailed = false;
        e.preventDefault();
        const { regMatrikel, regName, regEmail, regAdmin, regPassword, regPasswordRe } = this.state;
        const { register } = this.props;
        if(regPassword !== regPasswordRe){
            this.setState({
                noMatch: true,
                regPassword: "",
                regPasswordRe: ""
            });
            hasFailed = true;
        }
        if(!this.checkEmail(regEmail)){
            this.setState({
                incorrectEmailFormat: true,
                regEmail: ""
            });
            hasFailed = true;
        }
        if(!this.checkSID(regMatrikel)){
            this.setState({
                incorrectSIDFormat: true,
                regMatrikel: ""
            })
            hasFailed = true;
        }
        if(regMatrikel === "" || regName === "" || regEmail === "" || regPassword === ""){
            this.setState({
                incompleteForm: true,
            })
            hasFailed = true;
        }
        if(hasFailed){
            return;
        }
        console.log("Time to doxx the new user! Matrikel: "+regMatrikel+", Name: "+regName+", Email: "+regEmail+", Admin: "+regAdmin+", Password: "+regPassword);
        register(regMatrikel, regName, regEmail, regPassword);
    }

    render(){
        let warnings = [];
        if (this.state.noMatch) { warnings.push("Beide Passwörter müssen übereinstimmen!"); }
        if (this.state.incorrectEmailFormat) { warnings.push("Falsches Emailformat (muss auf @bht-berlin.de enden)!"); }
        if (this.state.incorrectSIDFormat) { warnings.push("Falsches Matrikelnr.-Format (muss eine sechsstellige Zahl sein)!"); }
        if (this.props.userExistsError) { warnings.push("Ein Nutzer mit dieser Matrikelnummer existiert bereits!"); }
        if (this.incompleteForm) { warnings.push("Das Formular ist unvollständig!"); }
        let warning;
        if (warnings.length > 0) {
            warning = (
                <div className="fMessage white">
                    {warnings.map((message, index) => <p key={index}>{message}</p>)}
                </div>
            );
        }else{
            warning = <p></p>;
        }

        return(
            <>
                <style>
                    {`
                        .fBody{
                            background-color: #ea3b07;
                        }
                        .rCancel{
                            background-color: #ffffff;
                            color: #ea3b07;
                            width: 15vw;
                            margin-right: 5vw;
                        }
                        .rCancel:hover{
                            background-color: #ea3b07;
                            color: #ffffff;
                        }
                        .regButtonAlign{
                            display: flex;
                            flex-direction: row;
                        }
                        .submit{
                            width: 15vw;
                        }
                        .submit:hover{
                            background-color: #60a2d2;
                            color: #004282;
                        }
                        .white{
                            color: #ffffff;
                            border-color: #ffffff;
                            margin-top: 20px;
                        }
                        .adminCheck{
                            color: #ffffff;
                            margin-top: 20px;
                            margin-bottom: 10px
                        }
                        .regIn{
                            width: 35vw;
                            height: 26px;
                            border-radius: 10px;
                            border: none;
                            margin-top: 10px;
                        }
                        .firstItem{
                            margin-top: 30px;
                        }
                    `}
                </style>
                <div className="formPage" onKeyDown={this.handleKeyPress}>
                    <div className="fAlignmentHelp">
                        <h1>Ist die Zeit für deine Bachelorarbeit gekommen?</h1>
                        <h2>Kein Problem - registriere dich hier!</h2>
                        <Form className="fBody">
                            <input className="regIn firstItem" type="number" id="matrikel" name="regMatrikel" value={this.state.regMatrikel} placeholder="Matrikelnr." onChange={this.handleInputChange}/>
                            <input className="regIn" type="text" id="name" name="regName" value={this.state.regName} placeholder="Name" onChange={this.handleInputChange}/>
                            <input className="regIn" type="email" id="email" name="regEmail" value={this.state.regEmail}placeholder="Email (muss auf '@bht-berlin.de' enden)" onChange={this.handleInputChange}/>
                            <div className="adminCheck">
                                <Form.Check label="Ich bin ein Admin" checked={this.regAdmin} onChange={this.handleCheck} disabled/>
                            </div>
                            <input className="regIn" type="password" id="password" name="regPassword" value={this.state.regPassword} placeholder="Passwort" onChange={this.handleInputChange}/>
                            <input className="regIn" type="password" id="passwordRe" name="regPasswordRe" value={this.state.regPasswordRe} placeholder="Passwort widerholen" onChange={this.handleInputChange}/>
                            { warning }
                            <div className="regButtonAlign">
                                <Button onClick={this.handleCancel} className="standardButton rCancel spaceTop">Abbrechen</Button>
                                <Button onClick={this.handleRegistration} className="standardButton submit spaceTop">Registrieren</Button>
                            </div>
                        </Form>
                    </div>
                    <img alt="kimbaa_login_logo" src="kimbaa_high_login.png"/>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    close: navActions.getNavLoginAction,
    register: authActions.registerUserAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPage);