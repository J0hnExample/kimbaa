import React, {createRef, Component} from "react";
import { connect } from "react-redux";
import logger from "../logging/logger";

import * as navActions from '../actions/NavActions';
import * as appActions from "../actions/ApplicationActions";
import { fetchPointStatus } from "../actions/ApplicationActions";
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
            appModulePoints: 0,
            appModuleRequirementsMet: false,
            appModuleViable: false,
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
        this.handleSave = this.handleSave.bind(this);
        this.splitName = this.splitName.bind(this);
    }

    async componentDidMount(){
        logger.info("MainApplicationPage.js mounted!");

        let moduleSummary = await fetchPointStatus(this.props.userResource._id);
        if(moduleSummary){
            this.setState({ 
                appModulePoints: moduleSummary.credits,
                appModuleRequirementsMet: moduleSummary.allrequired,
                appModuleViable: moduleSummary.minreqCredits
            });
        }
    }

    //teilt den namen in zwei 
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

    handleCheckChange(e){
        const { name, checked } = e.target;
        this.setState({[name]: checked });
    }

    handleDateChange(e){
        const { name, value } = e.target;
        this.setState({[name]: value});
    }

    //sorgt dafür, das Sommer und Winter Semester nicht gleichzeitig angekreuzt werden können
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

    //sorgt dafür das Bachelor und Master nicht gleichzeitig angekreuzt werden können
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

    //Aktulisiert den Antrag und kehrt zur Landing Page zurück
    handleSave(e){
        const{appMatrikel, appName ,appDepartment, appBachelor, appMaster, appPracticalSemesterDone, appPracticalSemesterAcknowledgement, appModuleRequirementsMet, appAttachment1, appAttachment2, appNoTopicProposition
            , appPhone, appStreet, appPlace, appPostal,
        } =  this.state;
        const [firstName, lastName] = this.splitName(appName);
        const{saveApplication} = this.props;
        saveApplication(appMatrikel, appDepartment, appBachelor, appMaster, appPracticalSemesterDone, appPracticalSemesterAcknowledgement, appModuleRequirementsMet, appAttachment1, appAttachment2, appNoTopicProposition, firstName, lastName, appPhone, appStreet, appPlace, appPostal);
        this.props.moveToLanding();
    }
    handleClose(){
        this.dialogRef.current.close();
    };
    handleOpen(){
        this.dialogRef.current.showModal();
    };

    render(){
        let requiredAbsolved = <>Du hast nicht alle Pflichtmodule absolviert. </>;
        if(this.state.appModuleRequirementsMet === true){
            requiredAbsolved = <>Du hast alle Pflichtmodule absolviert. </>;
        }
        let succeededModules = <>Du kannst daher noch keine Prüfung schreiben. Wenn diese Evaluation nicht stimmt, lade bitte deine aktuelle Modulbescheinigung auf der Hauptseite hoch. </>;
        if(this.state.appModuleViable === true){
            succeededModules = <>Du kannst zur Prüfung antreten!</>;
        }
        let specificOptions = <></>;
        if(this.state.appCourse){
            specificOptions = <>
                <Form.Group controlId="furtherDetails" className="spaceTop">
                <Form.Label className="mainApplicationLabel">Weitere Details (Zutreffendes ankreuzen):</Form.Label>
                <Form.Check label="Die Praxisphase wurde erfolgreich abgeschlossen" name="appPracticalSemesterDone" checked={this.state.appPracticalSemesterDone} onChange={this.handleCheckChange}/>
                <Form.Check label="Die Anerkennung der Praxisphase wurde beantragt oder ist bereits erfolgt." name="appPracticalSemesterAcknowledgement" checked={this.state.appPracticalSemesterAcknowledgement} onChange={this.handleCheckChange} />
                <p><b>Du hast {this.state.appModulePoints} von 155 benötigten Credits erlangt. {requiredAbsolved}{succeededModules}</b></p>
                <Form.Check label="Die Anlage 2 (mein Vorschlag zum Thema meiner Abschlussarbeit und des/der Betreuers*in) ist beigefügt." name="appAttachment2" checked={this.state.appAttachment2} onChange={this.handleCheckChange} />
                </Form.Group>
                <Form.Group controlId="declarationOfWaive" className="spaceTop">
                    <Form.Label className="mainApplicationLabel">Optionale Verzichterklärung</Form.Label>
                    <Form.Check label={<>Einen Vorschlag für das Thema und den/die Betreuer*in meiner Abschlussarbeit unterbreite ich nicht. <b>Ich wünsche die Vergabe durch den Prüfungsausschuss</b></>} name="appNoTopicProposition" checked={this.state.appNoTopicProposition} onChange={this.handleCheckChange} />
                </Form.Group>
            </>
        }
        let buttonStates = <Button className="standardButton buttonWidth" onClick={this.handleSave} disabled>Speichern</Button>;
        if(this.state.appCourse){
            buttonStates = <Button className="standardButton buttonWidth" onClick={this.handleSave}>Speichern</Button>;
        }

        return(
            <>
                <style>
                    {`
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
                    <Form className="mainApplicationForm whiteText">
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
                            <select className="textInput tiWide spaceTop" name="appCourse" value={this.state.appCourse} onChange={this.handleInputChange} >
                                <option value="">Bitte wähle eine Option!</option>
                                <option value="Medieninformatik">Medieninformatik</option>
                            </select>
                        </Form.Group>
                        {specificOptions}
                        <Form.Group controlId="SubmitOrLeave" className="spaceTop spaceBottom">
                            <div className="itemInlineRow">
                                <Button className="standardButton buttonWidth aCancel" onClick={this.handleOpen}>Abbrechen</Button>
                                {buttonStates}
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
    saveApplication: appActions.saveApplicationAction,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MainApplicationPage);