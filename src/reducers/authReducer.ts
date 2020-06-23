import {LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, CODE_REQUIRED, CODE_INCORRECT} from "../actions/authActions";
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
        loading: false,
        tempData: undefined
      };
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        loggedIn: false,
        error: null
      };
    case CODE_REQUIRED:
      return {
        ...state,
        loggedIn: false,
        loading: false,
        tempData: action.payload
      };
    case CODE_INCORRECT:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loggedIn: false,
        error: action.payload,
        loading: false,
        tempData: undefined
      };
    default:
      return state;
  }
};