import {
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  CODE_REQUIRED,
  CODE_INCORRECT,
  REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_ERROR, REFRESH_TOKEN_REQUEST
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
      };
    case LOGOUT:
      Token.remove();
      return {
        ...state,
        loggedIn: false,
        error: null,
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
    default:
      return state;
  }
};