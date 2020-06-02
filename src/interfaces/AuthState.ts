import {LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS} from "../actions/authActions";

export interface AuthState {
  loggedIn: boolean
}

interface AuthRequest {
  type: typeof LOGIN_REQUEST
}

interface AuthSuccess {
  type: typeof LOGIN_SUCCESS,
  payload: string
}

interface AuthError {
  type: typeof LOGIN_ERROR,
  payload: Error
}

export type AuthActionsTypes = AuthRequest & AuthSuccess & AuthError;