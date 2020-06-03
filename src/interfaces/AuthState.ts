import {LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS} from "../actions/authActions";
import {AuthData, IAuth, LoginError} from "../services/AuthApiService";

export interface AuthState {
  loggedIn: boolean,
  error?: LoginError
}

interface AuthRequest {
  type: typeof LOGIN_REQUEST,
  payload: AuthData
}

interface AuthSuccess {
  type: typeof LOGIN_SUCCESS,
  payload: IAuth
}

interface AuthError {
  type: typeof LOGIN_ERROR,
  payload: LoginError
}

export type AuthActionsTypes = AuthRequest & AuthSuccess & AuthError;