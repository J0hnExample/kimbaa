import Cookies from "js-cookie";
import logger from "../logging/logger";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


export const APPLICATION_PENDING = "APPLICATION_PENDING";
export const APPLICATION_FAILURE = "APPLICATION_FAILURE";
export const APPLICATION_SUCCESS = "APPLICATION_SUCCESS";

function getSaveApplicationPending(){ return { type: APPLICATION_PENDING } }
function getSaveApplicationFail(err){ return { type: APPLICATION_FAILURE, err: err } }
function getSaveApplicationSuccess(){ return { type: APPLICATION_SUCCESS, payload: 'landing' } }

export function saveApplicationAction(studentId, department,bachelor, master, practicalDone, practicalAcknowlegded, reqMet, att1, att2, noTopicProposition  ){
    return dispatch => {
        dispatch(getSaveApplicationPending());
        saveApplication(studentId, department, bachelor, master, practicalDone, practicalAcknowlegded, reqMet, att1, att2, noTopicProposition)
            .then(() => {
                Cookies.set('currentPage', 'Landing', { sameSite: 'Strict' })
                dispatch(getSaveApplicationSuccess())
            })
            .catch(err => {
                dispatch(getSaveApplicationFail(err))
            })
    }
}

function saveApplication( studentId, department, bachelor, master, practicalDone, practicalAcknowlegded, reqMet, att1, att2, noTopicProposition ){
    const ApplicationForm = {
        studentid: studentId, // Matrikelnummer
        department: department, // Fachbereich
        bachelor: bachelor, // Bachelor
        master: master, // Master
        internshipCompleted: practicalDone, // Praxisphase abgeschlossen
        recognitionApplied: practicalAcknowlegded, // Anerkennung beantragt
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
        body: JSON.stringify(ApplicationForm),
        credentials: 'include'
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
        course: course,
    }

    console.log('ApplicationForm:', ApplicationForm);

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ApplicationForm),
        credentials: 'include'
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

export const REFRESH_SUCCESS = "REFRESH_SUCCESS";
export const REFRESH_FAILURE = "REFRESH_FAILURE";

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
        credentials: 'include'
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


export const APPLICATION_FETCH_PENDING = "APPLICATION_FETCH_PENDING";
export const APPLICATION_FETCH_FAILURE = "APPLICATION_FETCH_FAILURE";
export const APPLICATION_FETCH_SUCCESS = "APPLICATION_FETCH_SUCCESS";


function getFetchApplicationPending(){ return { type: APPLICATION_FETCH_PENDING } }
function getFetchApplicationFail(err){ return { type: APPLICATION_FETCH_FAILURE, err: err } }
function getFetchApplicationSuccess(application){ return { type: APPLICATION_FETCH_SUCCESS, application: application, payload: 'landing' } }

export function getApplicationAction( studentId ){
    return dispatch => {
        dispatch(getFetchApplicationPending());
        getApplication( studentId )
            .then(applicationForm => {
                Cookies.set('application', JSON.stringify(applicationForm.antragZulassungDetails), { sameSite: 'Strict' });
                dispatch(getFetchApplicationSuccess(JSON.stringify(applicationForm.antragZulassungDetails)))
            })
            .catch(err => {
                dispatch(getFetchApplicationFail(err))
            })
    }
}

function getApplication( studentId ){
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    }

    console.log("fetching:" + BACKEND_URL + '/api/antragzulassung/' + studentId)
    return fetch(BACKEND_URL + '/api/antragzulassung/' + studentId, requestOptions)
        .then(response => {
            if(!response.ok){
                throw new Error('Error getting Application');
            }
            return response.json();
        })
}

// This Block deals with the uploading of the Module List on the Landing Page
export const MODULE_UPDATE_PENDING = "MODULE_UPDATE_PENDING";
export const MODULE_UPDATE_SUCCESS = "MODULE_UPDATE_SUCCESS";
export const MODULE_UPDATE_FAILURE = "MODULE_UPDATE_FAILURE";

function getModuleUpdatePending(){ return { type: MODULE_UPDATE_PENDING } };
function getModuleUpdateFailure(err){ return { type: MODULE_UPDATE_FAILURE, err: err } };
function getModuleUpdateSuccess(){ return { type: MODULE_UPDATE_SUCCESS } };

export function updateModuleAction(filteredModules){
    return dispatch => {
        dispatch(getModuleUpdatePending());
        updateModule(filteredModules)
            .then(() => {
                dispatch(getModuleUpdateSuccess());
            })
            .catch(err => {
                dispatch(getModuleUpdateFailure(err));
            })
    }
}

function updateModule(filteredModules){
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(filteredModules),
    }

    console.log("fetching:" + BACKEND_URL + '/api/modul/update')
    return fetch(BACKEND_URL + '/api/modul/update', requestOptions)
        .then(response => {
            if(!response.ok){
                throw new Error('Error updating Module (ApplicationActions.js)');
            }
            logger.info("Uploaded module list successfully!");
            return response.json();
        })
}

export const GET_PDFANTRAG_PENDING = "GET_PDFANTRAG_PENDING";
export const GET_PDFANTRAG_SUCCESS = "GET_PDFANTRAG_SUCCESS";
export const GET_PDFANTRAG_FAILURE = "GET_PDFANTRAG_FAILURE";

function getPDFAntragPending(){ return { type: GET_PDFANTRAG_PENDING } };
function getPDFAntragFailure(err){ return { type: GET_PDFANTRAG_FAILURE, err: err } };
function getPDFAntragSuccess(blob){ return { type: GET_PDFANTRAG_SUCCESS, payload:blob } };

export function getPdfAntragAction(studentId) {
    return dispatch => {
        dispatch(getPDFAntragPending());
        getPdfAntrag(studentId)
            .then(blob => {
                dispatch(getPDFAntragSuccess(blob));
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.click();
            })
            .catch(err => {
                dispatch(getPDFAntragFailure(err));
            });
    };
}

function getPdfAntrag(studentId) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    console.log("fetching:" + BACKEND_URL + "/api/pdfAntrag/" + studentId);
    return fetch(BACKEND_URL + '/api/pdfAntrag/' + studentId, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error getting pdfAntrag (ApplicationActions.js)');
            }
            logger.info("got pdfAntrag successfully!");
            return response.blob();
        });
}


export const PUT_USERDETAILS_PENDING = "PUT_USERDETAILS_PENDING";
export const PUT_USERDETAILS_FAILURE = "PUT_USERDETAILS_FAILURE";
export const PUT_USERDETAILS_SUCCESS = "PUT_USERDETAILS_SUCCESS";

function getPutUserdetailsPending(){ return { type: PUT_USERDETAILS_PENDING } }
function getPutUserdetailsFail(err){ return { type: PUT_USERDETAILS_FAILURE, err: err } }
function getPutUserdetailsSuccess(){ return { type: PUT_USERDETAILS_SUCCESS,  } }

export function putUserdetailsAction(studentId, street, city, postalCode, phone, nameFirst, nameLast){
    return dispatch => {
        dispatch(getPutUserdetailsPending());
        putUserdetails(studentId, street, city, postalCode , phone, nameFirst, nameLast)
            .then(() => {
                dispatch(getPutUserdetailsSuccess())
            })
            .catch(err => {
                dispatch(getPutUserdetailsFail(err))
            })
    }
}

function putUserdetails( studentId, street, city, postalCode, phone , nameFirst, nameLast){
    const userDetails = { 
        lastName: nameLast, 
        firstName: nameFirst, 
        street: street, 
        city: city, 
        postalCode: postalCode, 
        //country: place, 
        phone: phone 
    }

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails),
        credentials: 'include'
    }

    console.log("fetching:" + BACKEND_URL + '/api/userdetails/' + studentId)
    return fetch(BACKEND_URL + '/api/userdetails/' + studentId, requestOptions)
        .then(response => {
            if(!response.ok){
                throw new Error('Error while updating Userdetails ');
            }
            return response.json();
        })
}


export async function fetchPointStatus(studentId){
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    };

    logger.info("fetching:" + BACKEND_URL + '/api/modul/summary/' + studentId);
    const response = await fetch(BACKEND_URL + '/api/modul/summary/' + studentId, requestOptions);
    if (!response.ok) {
        logger.info("Request for Module Point Summary Failed (ApplicationActions.js)");
    }
    return await response.json();
}