import {Dispatch} from "react";
import AuthApiService, {AuthData, IAuth} from "../services/AuthApiService";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';

export const requestLoginAction = () => ({type: LOGIN_REQUEST});
export const successLoginAction = (data: IAuth) => ({type: LOGIN_SUCCESS, payload: data});
export const errorLoginAction = (error: Error) => ({type: LOGIN_ERROR, payload: error});

export const logoutAction = () => ({type: LOGOUT});


export const logIn = (authData: AuthData) => async (dispatch: Dispatch<object>): Promise<any> => {
  dispatch(requestLoginAction());
  await AuthApiService.authenticate(authData).then((response) => {
    dispatch(successLoginAction(response.data));
  }).catch((errorData) => {
    dispatch(errorLoginAction(errorData.response.data))
  });
};

export const logOut = () => (dispatch: Dispatch<object>): void => {
  dispatch(logoutAction());
};
