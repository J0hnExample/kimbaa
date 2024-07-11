import * as appActions from "../actions/ApplicationActions";
import * as navActions from "../actions/NavActions";
import Cookies from 'js-cookie';

const initialState = {
    application: Cookies.get('application') ? JSON.parse(Cookies.get('application')) : "empty",
}

function appReducer(state = initialState, action){
    switch(action.type){
        case appActions.APPLICATION_SUCCESS:
            Cookies.set('applications', [...state.applications, action.application], { sameSite: 'Strict' });
            return{
                ...state,
                applications: [...state.applications, action.application],
            }
        case navActions.LOGIN:
            Cookies.remove('application');
            return{
                ...state,
                applications: [],
                playTestApplication: "",
            }
        case appActions.APPLICATION_FETCH_SUCCESS:
            Cookies.set('application', action.application, { sameSite: 'Strict' });
            return{
                ...state,
                application: action.playTestApplication,
            }
        default:
            return{
                ...state,
            }
    }
}

export default appReducer;