import React, {Component} from 'react';
import './App.css';
import { connect } from 'react-redux';
import logger from './logging/logger';

import TopMenu from './components/TopMenu';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import MainApplicationPage from './components/MainApplicationPage';
import MainApplicationEditPage from './components/MainApplicationEditPage';
import UserEditPage from './components/UserEditPage';

const mapStateToProps = state => {
  return {
    page: state.root.page
  };
}

class App extends Component{

  componentDidMount(){
    logger.info("App.js mounted!");
  }

  render(){
    const page = this.props.page;
    let workspace;

    switch (page){
      case "landing":
        workspace = <LandingPage />
        break;
      case "login":
        workspace = <LoginPage />
        break;
      case "registration":
        workspace = <RegistrationPage />
        break;
      case "application":
        workspace = <MainApplicationPage />
        break;
      case "userEdit":
        workspace = <UserEditPage />
        break;
      case "applicationEdit":
        workspace = <MainApplicationEditPage />
        break;
      default:
        workspace = <LoginPage />
    }

    return (
      <div className='App'>
        <TopMenu />
        { workspace }
      </div>
    )
  }
}

export default connect(mapStateToProps)(App);