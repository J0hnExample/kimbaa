// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { applyMiddleware, legacy_createStore as createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import {thunk} from 'redux-thunk'; 
import rootReducer from './reducer/RootReducer';
import authReducer from './reducer/AuthReducer';
import appReducer from './reducer/ApplicationReducer';

/* let HOSTNAME = process.env.HOSTNAME || 'localhost';
let HTTP_PORT = process.env.HTTP_PORT || '3000';
let HTTPS_PORT = process.env.HTTPS_PORT || '3443';
 */
export let BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

/* if (process.env.HTTPS === 'true') {
  BACKEND_URL = `https://${HOSTNAME}:${HTTPS_PORT}`;
} else {
  BACKEND_URL = `http://${HOSTNAME}:${HTTP_PORT}`;
} */

console.log(`Using ${BACKEND_URL} as the backend url`);

const initialState = {};

const mainReducer = combineReducers({
  root: rootReducer,
  auth: authReducer,
  app: appReducer
});

const store = createStore(mainReducer, initialState, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
