import {User} from "../interfaces/User";
import {Dispatch} from "react";

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_ERROR = 'USER_ERROR';
export const USER_LOGOUT = 'USER_LOGOUT';

export const userLoadRequest = () => ({type: USER_REQUEST});
export const userLoadSuccess = (userData: User) => ({type: USER_SUCCESS, payload: userData});
export const userLogoutAction = () => ({type: USER_LOGOUT});

export const loadUserByToken = () => (dispatch: Dispatch<object>) => {
  dispatch(userLoadRequest());
  dispatch(userLoadSuccess({first_name: 'Mark', last_name: 'Ruffalo'}))
};

