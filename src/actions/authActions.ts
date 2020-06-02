import {Dispatch} from "react";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';

export const requestLoginAction = () => ({type: LOGIN_REQUEST});
export const successLoginAction = (token: string) => ({type: LOGIN_SUCCESS, payload: token});
export const errorLoginAction = (error: Error) => ({type: LOGIN_ERROR, payload: error});

export const logoutAction = () => ({type: LOGOUT});


export const logIn = (dispatch: Dispatch<object>): void => {
  dispatch(requestLoginAction());
  dispatch(successLoginAction('token'))
};

export const logOut = (dipatch: Dispatch<object>): void => {
  dipatch(logoutAction());
};
