import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import { connect } from "react-redux";
import logger from "../logging/logger";
import { bindActionCreators } from "redux";
import * as navActions from '../actions/NavActions';
import * as appActions from '../actions/ApplicationActions';
import { quickParser } from "../pdfParser/pdfParserSimplified";

const mapStateToProps = state => {
    return {
        userResource: state.auth.userResource,
        application: state.app.application,
        userToken: state.auth.userToken,
    }
}

class LandingPage extends Component {
    constructor(props) {
        super(props);

        let userResource = this.props.userResource;
        
        this.state = {
            appMatrikel: userResource.studentId ? userResource.studentId : "",
            appAttachmentFile: null,
            course: userResource.course ? userResource.course : "",
        }

        this.handleFileChange = this.handleFileChange.bind(this);
        this.handlePrintApplication = this.handlePrintApplication.bind(this);

    }

    componentDidMount(){
        const { appMatrikel } = this.state;

        this.props.getApplication(appMatrikel);
        logger.info("LandingPage.js mounted!");
    }

    componentDidUpdate(prevProps) {
        if (prevProps.application !== this.props.application && this.props.application) {
            console.log('New application data received:', this.props.application);
        }
    }

    handlePrintApplication(){
        const { appMatrikel } = this.state;
        const { getPDFAntrag } = this.props;

        getPDFAntrag(appMatrikel);
    }

    async handleFileChange(event){
        const uploadedFile = event.target.files[0];
        let userId = this.props.userResource._id;
        if(uploadedFile){
            this.setState({appAttachmentFile: uploadedFile});
            const arrayBuffer = await uploadedFile.arrayBuffer();
            const parsedData = await quickParser(arrayBuffer, userId);
            logger.info("Uploading: " + parsedData);
            this.props.updateModules(parsedData);
        }
    }

    render(){
        let name = this.props.userResource && this.props.userResource.name ? this.props.userResource.name : "John Default";
        let yourApplication = <></>;
        let application = typeof this.props.application === 'string' ? JSON.parse(this.props.application) : this.props.application;
        if(application){
            yourApplication =   <Card style={{ width: '18rem' }} className="card whiteText">
                                    <Card.Body>
                                        <Card.Title>
                                            {this.state.course}
                                        </Card.Title>
                                        <Card.Text >
                                            <Button className="cardButton" onClick={this.props.editApplication} > Antrag bearbeiten</Button> 
                                            <Button className="cardButton" onClick={this.handlePrintApplication}> Antrag Drucken</Button>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
        }

        return (
            <>
                <Container className="fLanding">
                    <h1>Willkommen bei kimbaa!</h1>
                    <p> Schön, dich zu sehen, {name}!</p>
                </Container>
                <Container className="fGrid">
                    <Card style={{ width: '18rem' }} className="card whiteText">
                        <Card.Body>
                            <Card.Title>
                                <Button className="cardButton" onClick={this.props.makeApplication}> Neuen Antrag Anlegen</Button>
                            </Card.Title>
                            <Card.Text>Hier kannst du einen neuen Bachelorantrag erstellen!</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }} className="card whiteText">
                        <Card.Body>
                            <div className="fLandingModUpload">
                                <input type="file" onChange={this.handleFileChange} accept=".pdf" />
                            </div>
                            <Card.Text>
                                Hier kannst du Module sowie Creditpoints importieren
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }} className="card whiteText">
                        <Card.Body>
                            <Card.Title><Button className="cardButton" onClick={this.props.userUpdate}>Nutzerdaten bearbeiten</Button> </Card.Title>
                            <Card.Text>
                                Hier kannst du Details deines Accounts bearbeiten.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    {yourApplication}
                </Container>
            </>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    makeApplication: navActions.getNavApplicationPageAction,
    userUpdate: navActions.getNavUserEditPageAction,
    editApplication: navActions.getNavApplicationEditPageAction,
    getApplication: appActions.getApplicationAction,
    updateModules: appActions.updateModuleAction,
    getPDFAntrag: appActions.getPdfAntragAction,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);