import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT} from "../actions/authActions";
import {AuthActionsTypes, AuthState} from "../interfaces/AuthState";

const initialState: AuthState = {
  loggedIn: !!sessionStorage.getItem('token')
};

export default (state = initialState, action: AuthActionsTypes) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return state;
    case LOGIN_SUCCESS:
      sessionStorage.setItem('token', action.payload);
      return {
        ...state,
        loggedIn: true
      };
    case LOGOUT:
      sessionStorage.removeItem('token');
      return {
        ...state, loggedIn: false
      }
    default:
      return state;
  }
};