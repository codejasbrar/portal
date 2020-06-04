import {LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT} from "../actions/authActions";
import {AuthActionsTypes, AuthState} from "../interfaces/AuthState";

const initialState: AuthState = {
  loggedIn: !!localStorage.getItem('token'),
  loading: false
};

export default (state = initialState, action: AuthActionsTypes) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {...state, loading: true};
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        loggedIn: true,
        error: null,
        loading: false
      };
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        loggedIn: false,
        error: null
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loggedIn: false,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};