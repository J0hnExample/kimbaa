import Cookies from 'js-cookie';

export const LOGIN = "LOGIN";
export const LANDING = "LANDING";
export const REGISTRATION = "REGISTRATION";
export const APPLICATION = "APPLICATION";
export const USEREDIT = "USEREDIT";
export const APPLICATIONEDIT = "APPLICATIONEDIT";

export function getNavLoginAction(){
    Cookies.set('currentPage', 'login', { sameSite: 'Strict' });
    Cookies.remove('userResource');
    return {
        type: LOGIN,
        payload: 'login'
    }
}
export function getNavLandingAction(){
    Cookies.set('currentPage', 'landing', { sameSite: 'Strict' });
    return {
        type: LANDING,
        payload: 'landing'
    }
}
export function getNavRegistrationPageAction(){
    Cookies.set('currentPage', 'registration', { sameSite: 'Strict' });
    return {
        type: REGISTRATION,
        payload: 'registration'
    }
}
export function getNavApplicationPageAction(){
    Cookies.set('currentPage', 'application', { sameSite: 'Strict' });
    return {
        type: APPLICATION,
        payload: 'application'
    }
}
export function getNavUserEditPageAction(){
    Cookies.set('currentPage', 'userEdit', { sameSite: 'Strict' });
    return {
        type: USEREDIT,
        payload: 'userEdit'
    }
}
export function getNavApplicationEditPageAction(){
    Cookies.set('currentPage', 'applicationEdit', { sameSite: 'Strict' });
    return {
        type: APPLICATIONEDIT,
        payload: 'applicationEdit'
    }
}