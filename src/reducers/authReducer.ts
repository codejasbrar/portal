import {LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT} from "../actions/authActions";
import {AuthActionsTypes, AuthState} from "../interfaces/AuthState";

const initialState: AuthState = {
  loggedIn: !!sessionStorage.getItem('token')
};

export default (state = initialState, action: AuthActionsTypes) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return state;
    case LOGIN_SUCCESS:
      console.log(action.payload);
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        loggedIn: true,
        error: null
      };
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state, loggedIn: false, error: null
      };
    case LOGIN_ERROR:
      return {
        ...state, loggedIn: false, error: action.payload
      };
    default:
      return state;
  }
};