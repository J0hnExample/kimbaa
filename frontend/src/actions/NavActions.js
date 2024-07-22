import Cookies from 'js-cookie';

export const LOGIN = "LOGIN";
export const LANDING = "LANDING";
export const REGISTRATION = "REGISTRATION";
export const APPLICATION = "APPLICATION";
export const USEREDIT = "USEREDIT";
export const APPLICATIONEDIT = "APPLICATIONEDIT";

//navigiert zu der Seite, auf der der User sich einloggen kann
export function getNavLoginAction(){
    Cookies.set('currentPage', 'login', { sameSite: 'Strict' });
    Cookies.remove('userResource');
    return {
        type: LOGIN,
        payload: 'login'
    }
}
//navigiert zu der landing Seite
export function getNavLandingAction(){
    Cookies.set('currentPage', 'landing', { sameSite: 'Strict' });
    return {
        type: LANDING,
        payload: 'landing'
    }
}
//navigiert zu der Seite, auf der die Registration stattfindet
export function getNavRegistrationPageAction(){
    Cookies.set('currentPage', 'registration', { sameSite: 'Strict' });
    return {
        type: REGISTRATION,
        payload: 'registration'
    }
}
//navigiert zu der Seite, auf der die Application erstellt werden kann
export function getNavApplicationPageAction(){
    Cookies.set('currentPage', 'application', { sameSite: 'Strict' });
    return {
        type: APPLICATION,
        payload: 'application'
    }
}
//navigiert zu der Seite, auf der die USerdaten und die Userdetails verändert Werden können
export function getNavUserEditPageAction(){
    Cookies.set('currentPage', 'userEdit', { sameSite: 'Strict' });
    return {
        type: USEREDIT,
        payload: 'userEdit'
    }
}
//navigiert zu der Seite, auf der die Application daten verändert werden können
export function getNavApplicationEditPageAction(){
    Cookies.set('currentPage', 'applicationEdit', { sameSite: 'Strict' });
    return {
        type: APPLICATIONEDIT,
        payload: 'applicationEdit'
    }
}