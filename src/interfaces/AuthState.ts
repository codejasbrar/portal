import {AuthData, IAuth, LoginError} from "../services/AuthApiService";

export interface AuthState {
  loggedIn: boolean,
  error?: LoginError,
  loading: boolean,
  tempData?: AuthData,
  message?: string
}
