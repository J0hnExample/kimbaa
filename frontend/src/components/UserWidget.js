import React, {Component} from "react";
import Cookies from 'js-cookie';
import logger from "../logging/logger";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as navActions from '../actions/NavActions';

const mapStateToProps = state => {
    return state;
}

class UserWidget extends Component{
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){
        logger.info("MainApplicationEditPage.js mounted!");
    }

    handleLogout(e){
        const { logout } = this.props;
        logout();
        Cookies.set('loggedIn', false);
    }

    render(){
        return(
            <>
            <style>
                {`
                    .logoutButton{
                        font-family: BHTTitle;
                        font-size: 17px;
                        color: #ffc900;
                        background-color: #004282;
                        border: none;
                        border-radius: 12px;
                        padding-left: 14px;
                        padding-right: 14px;
                        padding-top: 6px;
                        padding-bottom: 6px;
                        margin-left: calc(100vw - 450px);
                    }
                    .logoutButton:hover{
                        background-color: #00a0aa;
                    }
                `}
            </style>
            <button onClick={this.handleLogout} className="logoutButton">
                Logout
            </button>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    logout: navActions.getNavLoginAction,
}, dispatch);

const ConnectedUserWidget = connect(mapStateToProps, mapDispatchToProps)(UserWidget);

export default ConnectedUserWidget;