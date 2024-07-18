import React, {createRef, Component} from "react";
import { connect } from "react-redux";
import logger from "../logging/logger";

import * as navActions from '../actions/NavActions';
import * as appActions from "../actions/ApplicationActions";
import { bindActionCreators } from "redux";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const mapStateToProps = state => {
    return{
        userResource: state.auth.userResource
    }
}

class MainApplicationPage extends Component{
    
    constructor(props){
        super(props);

        let userResource = this.props.userResource;

        this.state = {
            appSemWinter: true,
            appSemSummer: false,
            appMatrikel: userResource.studentId ? userResource.studentId : "",
            appDepartment: "",
            appName: userResource.name ? userResource.name : "",
            appEmail: userResource.email ? userResource.email : "",
            appPhone: "",
            appStreet: "",
            appPlace: "",
            appPostal: "",
            appCourse: "",
            appBachelor: true,
            appMaster: false,
            appModuleRequirementsMet: false,
            appAttachment1: false,
            appAttachment2: false,
            appNoTopicProposition: false,
            appPracticalSemesterDone: false,
            appPracticalSemesterAcknowledgement: false,
            dateFrom: Date,
            dateTo: Date,
        }

        this.dialogRef = createRef();

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSemester = this.handleSemester.bind(this);
        this.handleDegree = this.handleDegree.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSaveReal = this.handleSaveReal.bind(this);
    }

    componentDidMount(){
        logger.info("MainApplicationPage.js mounted!");
    }

    handleInputChange(e){
        const { name, value } = e.target;
        this.setState({[name]: value});
    }

    handleCheckChange(e){
        const { name, checked } = e.target;
        this.setState({[name]: checked });
    }

    handleDateChange(e){
        const { name, value } = e.target;
        this.setState({[name]: value});
        //implement min and max here
    }

    handleSemester(e){
        const { name, checked } = e.target;
        this.setState({[name]: checked});
        if(!checked){
            return;
        }
        if(name === "appSemWinter"){
            this.setState({"appSemSummer": false });
        }else if(name === "appSemSummer"){
            this.setState({"appSemWinter": false });
        }
    }

    handleDegree(e){
        const { name, checked } = e.target;
        this.setState({[name]: checked});
        if(!checked){
            return;
        }
        if(name === "appBachelor"){
            this.setState({"appMaster": false });
        }else if(name === "appMaster"){
            this.setState({"appBachelor": false });
        }
    }


    handleSaveReal(e){
        const{appMatrikel, appDepartment, appBachelor, appMaster, appPracticalSemesterDone, appPracticalSemesterAcknowledgement, appModuleRequirementsMet, appAttachment1, appAttachment2, appNoTopicProposition, dateFrom, dateTo } =  this.state;
        const{saveApplicationReal} = this.props;
        saveApplicationReal(appMatrikel, appDepartment, appBachelor, appMaster, appPracticalSemesterDone, appPracticalSemesterAcknowledgement, appModuleRequirementsMet, appAttachment1, appAttachment2, appNoTopicProposition, dateFrom, dateTo );
    }
    handleClose(){
        this.dialogRef.current.close();
    };
    handleOpen(){
        this.dialogRef.current.showModal();
    };

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
                    <h1>Antrag anlegen</h1>
                    <Form className="mainApplicationForm">
                        <Form.Group controlId="personalDetails" className="itemInlineColumn">
                            <Form.Label className="mainApplicationLabel">Persönliche Daten</Form.Label>
                            <div className="itemInlineRow">
                                <input className="textInput tiNarrow" type="number" placeholder="Matrikelnr." name="appMatrikel" value={this.state.appMatrikel} onChange={this.handleInputChange} />
                                <input className="textInput tiSmall" type="number" placeholder="Fachbereich" name="appDepartment" value={this.state.appDepartment} onChange={this.handleInputChange} />
                            </div>
                            <input className="textInput tiWide" type="text" placeholder="Name" name="appName" value={this.state.appName} onChange={this.handleInputChange} />
                            <input className="textInput tiWide" type="email" placeholder="Email-Adresse" name="appEmail" value={this.state.appEmail} onChange={this.handleInputChange} />
                            <input className="textInput tiWide" type="tel" placeholder="Telefonnummer" name="appPhone" value={this.state.appPhone} onChange={this.handleInputChange} />
                            <input className="textInput tiWide gapTop" type="text" placeholder="Straße" name="appStreet" value={this.state.appStreet} onChange={this.handleInputChange} />
                            <div className="itemInlineRow">
                                <input className="textInput tiSmall" type="number" placeholder="PLZ" name="appPostal" value={this.state.appPostal} onChange={this.handleInputChange} />
                                <input className="textInput tiNarrow" type="text" placeholder="Ort" name="appPlace" value={this.state.appPlace} onChange={this.handleInputChange} />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="semesterSelector" className="spaceTop">
                            <Form.Label className="mainApplicationLabel">In welchem Semester willst du die Abschlussprüfung belegen?</Form.Label>
                            <div className="itemInlineRow">
                                <Form.Check type="checkbox" name="appSemWinter" checked={this.state.appSemWinter} label="Wintersemester" onChange={this.handleSemester}/>
                                <Form.Check type="checkbox" name="appSemSummer" checked={this.state.appSemSummer} label="Sommersemester" onChange={this.handleSemester}/>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="degreeSelector" className="spaceTop">
                            <Form.Label className="mainApplicationLabel">Willst du eine Bachelor- oder Masterarbeit ablegen?</Form.Label>
                            <div className="itemInlineRow">
                                <Form.Check type="checkbox" name="appBachelor" checked={this.state.appBachelor} label="Bachelorarbeit" onChange={this.handleDegree}/>
                                <Form.Check type="checkbox" name="appMaster" checked={this.state.appMaster} label="Masterarbeit" onChange={this.handleDegree}/>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="courseInput" className="spaceTop">
                            <Form.Label className="mainApplicationLabel">In welchem Studiengang möchtest du den Kurs anlegen?</Form.Label>
                            <input className="textInput tiWide" type="text" placeholder="Studiengang" name="appCourse" value={this.state.appCourse} onChange={this.handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="furtherDetails" className="spaceTop">
                            <Form.Label className="mainApplicationLabel">Weitere Details (Zutreffendes ankreuzen):</Form.Label>
                            <Form.Group >
                                <Form.Check label="Die Praxisphase wird abgeleistet vom:"  /> 
                                <input type="date" name="dateFrom" value={this.state.dateFrom} onChange={this.handleDateChange} placeholder="" />
                                <Form.Label >bis</Form.Label>
                                <input type="date" name="dateTo" value={this.state.dateTo} onChange={this.handleDateChange} placeholder="" />
                            </Form.Group> 
                            <Form.Check label="Die Praxisphase wurde erfolgreich abgeschlossen" name="appPracticalSemesterDone" value={this.state.appPracticalSemesterDone} onChange={this.handleCheckChange}/>
                            <Form.Check label="Die Anerkennung der Praxisphase wurde beantragt oder ist bereits erfolgt." name="appPracticalSemesterAcknowledgement" value={this.state.appPracticalSemesterAcknowledgement} onChange={this.handleCheckChange} />
                            <Form.Check label="Sämtliche erforderliche Module des Bachelor- oder Masterstudiums sind erfolgreich abgeschlossen." name="appModuleRequirementsMet" value={this.state.appModuleRequirementsMet} onChange={this.handleCheckChange} />
                            <Form.Check label="Der erfolgreiche Abschluss der in Anlage 1 angeführten Module steht noch aus" name="appAttachment1" value={this.state.appAttachment1} onChange={this.handleCheckChange} />
                            <Form.Check label="Die Anlage 2 (mein Vorschlag zum Thema meiner Abschlussarbeit und des/der Betreuers*in) ist beigefügt." name="appAttachment2" value={this.state.appAttachment2} onChange={this.handleCheckChange} />
                        </Form.Group>
                        <Form.Group controlId="declarationOfWaive" className="spaceTop">
                            <Form.Label className="mainApplicationLabel">Optionale Verzichterklärung</Form.Label>
                            <Form.Check label={<>Einen Vorschlag für das Thema und den/die Betreuer*in meiner Abschlussarbeit unterbreite ich nicht. <b>Ich wünsche die Vergabe durch den Prüfungsausschuss</b></>} name="appNoTopicProposition" value={this.state.appNoTopicProposition} onChange={this.handleCheckChange} />
                        </Form.Group>
                        <Form.Group controlId="SubmitOrLeave" className="spaceTop spaceBottom">
                            <div className="itemInlineRow">
                                <Button className="standardButton buttonWidth aCancel" onClick={this.handleOpen}>Abbrechen</Button>
                                <Button className="standardButton buttonWidth" onClick={this.handleSaveReal}>Speichern</Button>
                            </div>
                        </Form.Group>
                    </Form>
                    <dialog ref={this.dialogRef} className="modal">
                        <div className="diaContent">
                            <h2>Bist du sicher dass du deine Änderungen verwerfen willst?</h2>
                            <button className="standardButton dia dLeft" onClick={this.handleClose}>Zurück</button>
                            <button className="standardButton dia" onClick={this.props.moveToLanding}>Antrag Schließen</button>
                        </div>
                    </dialog>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    moveToLanding: navActions.getNavLandingAction,
    saveApplicationReal: appActions.saveApplicationAction,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MainApplicationPage);