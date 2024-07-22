import * as appActions from "../actions/ApplicationActions";
import * as navActions from "../actions/NavActions";
import Cookies from 'js-cookie';

const initialState = {
    application: Cookies.get('application') ? JSON.parse(Cookies.get('application')) : null,
}

function appReducer(state = initialState, action){
    switch(action.type){
        case appActions.APPLICATION_SUCCESS:
            Cookies.set('application', action.application, { sameSite: 'Strict' });
            return{
                ...state,
                application: action.application,
            }
        case appActions.APPLICATION_FETCH_SUCCESS:
            return{
                ...state,
                application: action.application,
            }

        case navActions.LOGIN:
            Cookies.remove('application');
            return{
                ...state,
                application: null,
            }
        default:
            return{
                ...state,
            }
    }
}

export default appReducer;