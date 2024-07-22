import React, { Component} from "react";
import { connect } from "react-redux";
import logger from "../logging/logger";

import * as navActions from '../actions/NavActions';
import * as appActions from "../actions/ApplicationActions";
import { bindActionCreators } from "redux";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const mapStateToProps = state => {
    return{
        userResource: state.auth.userResource,
        application: state.app.application,
        userToken: state.auth.userToken,
    }
}

class UserEditPage extends Component{
    
    constructor(props){
        super(props);
        
        let userResource = this.props.userResource ? this.props.userResource : "missing";
        let applicationreal = typeof this.props.application === 'string' ? JSON.parse(this.props.application) : this.props.application;


        this.state = {
            uEUserId: userResource._id ? userResource._id : userResource.id,
            uEstudentId: userResource.studentId ? userResource.studentId : "",
            uEName: userResource.name ? userResource.name : "",
            uEStreet: applicationreal.userDetails ? applicationreal.userDetails.street ? applicationreal.userDetails.street : "" : "",
            uEPlace: applicationreal.userDetails ? applicationreal.userDetails.city ? applicationreal.userDetails.city : "" : "",
            uEPostal: applicationreal.userDetails ? applicationreal.userDetails.postalCode ? applicationreal.userDetails.postalCode : "" : "",
            uEEmail: userResource.email ? userResource.email : "",
            uECourse: userResource.course ? userResource.course : "",
            uEPhone: applicationreal.userDetails ? applicationreal.userDetails.phone ? applicationreal.userDetails.phone : "" : "",
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSaveUser = this.handleSaveUser.bind(this);
        this.splitName = this.splitName.bind(this);
    }

    componentDidMount(){
        const { uEstudentId } = this.state;
        this.props.getApplication(uEstudentId);
        logger.info("UserEditPage.js mounted!");
    }

    componentDidUpdate(prevProps) {
        if (prevProps.application !== this.props.application && this.props.application) {
            console.log('New application data received:', this.props.application);
        }
    }

    splitName(name) {
        const parts = name.split(' ');
        if (parts.length > 2) {
            const firstName = parts.slice(0, parts.length - 1).join(' ');
            const lastName = parts[parts.length - 1];
            return [firstName, lastName];
        }
        if (parts.length === 2) {
            return parts;
        }
        return [name, ''];
    }

    handleInputChange(e){
        const { name, value } = e.target;
        this.setState({[name]: value});
    }

    async handleSaveUser(e) {
        e.preventDefault(); // Prevent default form submission behavior
        const { uEstudentId, uEName, uEEmail, uECourse, uEUserId, uEStreet, uEPlace, uEPostal , uEPhone} = this.state;
        const { saveUserAction, refreshUE } = this.props;
        const [firstName, lastName] = this.splitName(uEName);
        try {
            // Await saveUser to ensure it completes before calling refreshResource
            await saveUserAction(uEstudentId, uEName, uEEmail, uECourse, uEUserId);
            await this.props.updateUserdetails(uEstudentId , uEStreet, uEPlace, uEPostal,uEPhone, firstName, lastName);
            await refreshUE(uEstudentId);
        } catch (error) {
            console.error("Error saving user and refreshing resource:", error);
        }
    }
    

    render(){
        return(
            <>
                <style>
                    {`
                        .itemInlineRow{
                            display: flex;
                            flex-direction: row;
                        }
                        .itemInlineColumn{
                            display: flex;
                            flex-direction: column;
                        }
                        label{
                            margin-right: 2vw;
                        }
                        input{
                            margin-top: 8px;
                            margin-left: 10px;
                        }
                        .textInput{
                            height: 24px;
                            border-radius: 12px;
                            border: none;
                            padding: 2px;
                            padding-left: 3px;
                            padding-right: 3px;
                            margin-right: 5vw;
                        }
                        .tiSmall{
                            width: 15vw;
                        }
                        .tiNarrow{
                            width: 25vw;
                        }
                        .tiWide{
                            width: calc(45vw + 16px);
                        }
                        .gapTop{
                            margin-top: 20px;
                        }
                        .buttonWidth{
                            width: 15vw;
                        }
                        .aCancel{
                            background-color: #ea3b07;
                            color: #ffffff;
                            margin-right: 17vw;
                        }
                        .aCancel:hover{
                            background-color: #ffffff;
                            color: #ea3b07;
                        }
                        .diaContent{
                            margin-left: 1vw;
                            margin-right: 1vw;
                        }
                        .dia{
                            width: 12vw;
                        }
                        .dLeft{
                            margin-right: 3vw;
                        }
                    `}
                </style>
                <div className="mainApplicationPage">
                    <h1>Nutzerdaten bearbeiten & ergänzen</h1>
                    <Form className="mainApplicationForm">
                        <Form.Group controlId="details" className="itemInlineColumn">
                            <Form.Label className="mainApplicationLabel">Ergänze oder ändere hier deine persönlichen Daten. Die Daten können genutzt werden, um deinen Bachelorantrag z.T. vorauszufüllen.</Form.Label>
                            <input className="textInput tiWide spaceTop" type="number" placeholder="Matrikel" name="uEStudentId" value={this.state.uEstudentId} disabled/>
                            <input className="textInput tiWide" type="text" placeholder="Name" name="uEName" value={this.state.uEName} onChange={this.handleInputChange} />
                            <input className="textInput tiWide gapTop" type="text" placeholder="Straße" name="uEStreet" value={this.state.uEStreet} onChange={this.handleInputChange} />
                            <div className="itemInlineRow">
                                <input className="textInput tiSmall" type="number" placeholder="PLZ" name="uEPostal" value={this.state.uEPostal} onChange={this.handleInputChange} />
                                <input className="textInput tiNarrow" type="text" placeholder="Ort" name="uEPlace" value={this.state.uEPlace} onChange={this.handleInputChange} />
                            </div>
                            <input className="textInput tiWide" type="text" placeholder="Email" name="uEEmail" value={this.state.uEEmail} onChange={this.handleInputChange} />
                            <input className="textInput tiWide" type="text" placeholder="Studiengang" name="uECourse" value={this.state.uECourse} onChange={this.handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="SubmitOrLeave" className="spaceTop spaceBottom">
                            <div className="itemInlineRow">
                                <Button className="standardButton buttonWidth aCancel" onClick={this.props.moveToLanding}>Abbrechen</Button>
                                <Button className="standardButton buttonWidth" onClick={this.handleSaveUser}>Speichern</Button>
                            </div>
                        </Form.Group>
                    </Form>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    moveToLanding: navActions.getNavLandingAction,
    saveUserAction: appActions.saveUserAction,
    refreshUE: appActions.refreshUE,
    updateUserdetails: appActions.putUserdetailsAction,
    getApplication: appActions.getApplicationAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserEditPage);