import {Dispatch} from "react";
import AuthApiService, {AuthData, IAuth} from "../services/AuthApiService";
import {userLogoutAction} from "./userActions";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';
export const CODE_REQUIRED = 'CODE_REQUIRED';
export const CODE_INCORRECT = 'CODE_INCORRECT';

export const requestLoginAction = () => ({type: LOGIN_REQUEST});
export const successLoginAction = (data: IAuth) => ({type: LOGIN_SUCCESS, payload: data});
export const errorLoginAction = (error: Error) => ({type: LOGIN_ERROR, payload: error});

export const codeRequiredAction = (data: IAuth) => ({type: CODE_REQUIRED, payload: data});
export const codeIncorrectAction = (error: Error) => ({type: CODE_INCORRECT, payload: error});

export const logoutAction = () => ({type: LOGOUT});

export const logIn = (authData: AuthData) => async (dispatch: Dispatch<object>): Promise<any> => {
  dispatch(requestLoginAction());
  await AuthApiService.authenticate(authData).then((response) => {
    dispatch(successLoginAction(response.data));
  }).catch((errorData) => {
    if (errorData.response && errorData.response.data.message.includes('2FA')) {
      errorData.response.data.error === "CODE_INCORRECT" ? dispatch(codeIncorrectAction(errorData.response.data)) : dispatch(codeRequiredAction(errorData.response.config.data));
    } else {
      dispatch(errorLoginAction(errorData.response.data));
    }
  });
};

export const logOut = () => (dispatch: Dispatch<object>): void => {
  dispatch(logoutAction());
  dispatch(userLogoutAction());
};
