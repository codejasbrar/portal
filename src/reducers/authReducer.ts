import {
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  CODE_REQUIRED,
  CODE_INCORRECT,
  REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_ERROR, REFRESH_TOKEN_REQUEST, CLEAR_TEMP_DATA, FILL_TEMP, CLEAR_ERROR
} from "../actions/authActions";
import {AuthActionsTypes, AuthState} from "../interfaces/AuthState";
import Token from "../helpers/localToken";

const initialState: AuthState = {
  loggedIn: !!localStorage.getItem('token'),
  loading: false
};

export default (state = initialState, action: AuthActionsTypes) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {...state, loading: true};
    case LOGIN_SUCCESS:
      Token.set(action.payload);
      return {
        ...state,
        loggedIn: true,
        error: null,
        loading: false,
        tempData: undefined,
        message: null
      };
    case LOGOUT:
      Token.remove();
      return {
        ...state,
        loggedIn: false,
        error: null,
      };
    case CLEAR_TEMP_DATA:
      return {
        ...state,
        tempData: undefined
      };
    case CODE_REQUIRED:
      return {
        ...state,
        loggedIn: false,
        loading: false,
        error: null,
        tempData: action.payload,
        message: action.message
      };
    case FILL_TEMP:
      return {
        ...state,
        tempData: action.payload,
        message: action.message
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
    case REFRESH_TOKEN_REQUEST:
      Token.remove();
      return {
        ...state,
        loggedIn: true
      };
    case REFRESH_TOKEN_SUCCESS:
      Token.set(action.payload);
      return {
        ...state,
        loggedIn: true,
        error: null,
        loading: false,
      };
    case REFRESH_TOKEN_ERROR:
      Token.remove();
      return state;
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    default:
      return state;
  }
};
