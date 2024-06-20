import Cookies from "js-cookie";

import {BACKEND_URL} from '../index.js'
// import {logger} from './logger/testLogger'


export const APPLICATION_PENDING = "APPLICATION_PENDING";
export const APPLICATION_FAILURE = "APPLICATION_FAILURE";
export const APPLICATION_SUCCESS = "APPLICATION_SUCCESS";


function getSaveApplicationPending(){ return { type: APPLICATION_PENDING } }
function getApplicationFail(err){ return { type: APPLICATION_FAILURE, err: err } }
function getApplicationSuccess(applicationForm){ return { type: APPLICATION_SUCCESS, playTestApplication: applicationForm, payload: 'landing' } }

export function saveApplicationAction(studentId, department,bachelor, master, practicalDone, practicalAcknowlegded, reqMet, att1, att2, noTopicProposition , dateFrom, dateTo ){
    return dispatch => {
        dispatch(getSaveApplicationPending());
        saveApplicationReal(studentId, department, bachelor, master, practicalDone, practicalAcknowlegded, reqMet, att1, att2, noTopicProposition, dateFrom, dateTo)
            .then(applicationForm => {
                Cookies.set('currentPage', 'Landing', { sameSite: 'Strict' })
                dispatch(getApplicationSuccess(applicationForm))
            })
            .catch(err => {
                dispatch(getApplicationFail(err))
            })
    }
}

function saveApplicationReal( studentId, department,bachelor, master, practicalDone, practicalAcknowlegded, reqMet, att1, att2, noTopicProposition , dateFrom, dateTo){
    const ApplicationForm = {
        //creator?:  , // Ersteller
        //attach1id?: ; // Anlage 1 ID
        //attach2id?: ; // Anlage 2 ID
        studentid: studentId, // Matrikelnummer
        department: department, // Fachbereich
        bachelor: bachelor, // Bachelor
        master: master, // Master
        //userDetails?: ; // Benutzerdaten
        internshipCompleted: practicalDone, // Praxisphase abgeschlossen
        recognitionApplied: practicalAcknowlegded, // Anerkennung beantragt
        internshipCompletedFrom: dateFrom, // Praxisphase abgeleistet von
        internshipCompletedTo: dateTo, // Praxisphase abgeleistet bis
        modulesCompleted: reqMet, // Module abgeschlossen
        modulesPending: att1, // Module ausstehend
        attachment2Included: att2, // Anlage 2 beigefügt
        topicSuggestion: noTopicProposition, // Thema vorgeschlagen
    }

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ApplicationForm)
    }

    console.log("fetching:" + BACKEND_URL + '/api/antragzulassung/' + studentId)
    return fetch(BACKEND_URL + '/api/antragzulassung/' + studentId, requestOptions)
        .then(response => {
            if(!response.ok){
                throw new Error('Error while saving Application');
            }
            return response.json();
        })
}


export const USER_PENDING = "USER_PENDING";
export const USER_FAILURE = "USER_FAILURE";
export const USER_SUCCESS = "USER_SUCCESS";
export const REFRESH_SUCCESS = "REFRESH_SUCCESS";
export const REFRESH_FAILURE = "REFRESH_FAILURE";


function getSaveUserPending(){ return { type: USER_PENDING } }
function getSaveUserFail(err){ return { type: USER_FAILURE, err: err } }
function getSaveUserSuccess(){ return { type: USER_SUCCESS} }

export const saveUserAction = (studentId, name, email, course, id) => async (dispatch) => {
    dispatch(getSaveUserPending());
    try {
        await saveUser(studentId, name, email, course, id);
        Cookies.set('currentPage', 'landing', { sameSite: 'Strict' });
        dispatch(getSaveUserSuccess());
    } catch (err) {
        dispatch(getSaveUserFail(err));
        throw err; // Ensure the error is thrown to be caught in handleSaveUser
    }
}

function getRefreshResourceFailure(){ return { type: REFRESH_FAILURE, payload: 'landing' } }
function getRefreshResourceSuccess(userResource){ return { type: REFRESH_SUCCESS, userResource: userResource, payload: 'landing' } }

export const refreshUE = (studentId) => async (dispatch) => {
    try {
        const resource = await refreshUserResource(studentId);
        Cookies.set('currentPage', 'landing', { sameSite: 'Strict' });
        dispatch(getRefreshResourceSuccess(resource));
    } catch (err) {
        dispatch(getRefreshResourceFailure(err));
        throw err; // Ensure the error is thrown to be caught in handleSaveUser
    }
}

function refreshUserResource(studentId){
    const requestOptions = {
        method: 'GET',
    }

    console.log('fetching: ' + BACKEND_URL + '/api/user/' + studentId)
    return fetch(BACKEND_URL + '/api/user/' +studentId, requestOptions)
        .then(response => {
            if(!response.ok){
                throw new Error('Error while refreshing userResource');
            }
            return response.json();
        })
}

function saveUser( studentId, name, email, course , id){
    const ApplicationForm = {
        id: id,
        name: name,
        //password: string,
        //admin: boolean,
        studentId: studentId,
        //application: string,
        email: email,
        //createdAt: string,
        //updatedAt: string,
        //course: course,
    }

    console.log('ApplicationForm:', ApplicationForm);

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ApplicationForm)
    }

    console.log("fetching: " + BACKEND_URL + '/api/user/'+ studentId)
    return fetch(BACKEND_URL + '/api/user/'+ studentId, requestOptions)
        .then(response => {
            if(!response.ok){
                throw new Error('Error while saving User');
            }
            return response.json();
        })
}



export const APPLICATION_DELETE_PENDING = "APPLICATION_DELETE_PENDING";
export const APPLICATION_DELETE_FAILURE = "APPLICATION_DELETE_FAILURE";
export const APPLICATION_DELETE_SUCCESS = "APPLICATION_DELETE_SUCCESS";


function getDeleteApplicationPending(){ return { type: APPLICATION_DELETE_PENDING } }
function getDeleteApplicationFail(err){ return { type: APPLICATION_DELETE_FAILURE, err: err } }
function getDeleteApplicationSuccess(applicationForm){ return { type: APPLICATION_DELETE_SUCCESS, playTestApplication: applicationForm, payload: 'landing' } }

export function deleteApplicationAction( id){
    return dispatch => {
        dispatch(getDeleteApplicationPending());
        deleteApplication(id)
            .then(applicationForm => {
                Cookies.set('currentPage', 'Landing')
                dispatch(getDeleteApplicationSuccess(applicationForm))
            })
            .catch(err => {
                dispatch(getDeleteApplicationFail(err))
            })
    }
}

function deleteApplication(studentId){
    const requestOptions = {
        method: 'DELETE'
    }

    return fetch('http://localhost:8081/api/antragzulassung/'+ studentId, requestOptions)
        .then(response => {
            if(!response.ok){
                throw new Error('Error while saving Application');
            }
            return response.json();
        })
}