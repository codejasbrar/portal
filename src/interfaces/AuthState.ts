import {LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS} from "../actions/authActions";
import {AuthData, IAuth, LoginError} from "../services/AuthApiService";

export interface AuthState {
  loggedIn: boolean,
  error?: LoginError,
  loading: boolean,
  tempData?: AuthData,
}

interface AuthRequest {
  type: typeof LOGIN_REQUEST,
  payload: AuthData,
  loading: boolean
}

interface AuthSuccess {
  type: typeof LOGIN_SUCCESS,
  payload: IAuth,
  loading: boolean
}

interface AuthError {
  type: typeof LOGIN_ERROR,
  payload: LoginError,
  loading: boolean
}

export type AuthActionsTypes = AuthRequest & AuthSuccess & AuthError;