import {User} from "../interfaces/User";
import {Dispatch} from "react";
import ProfileService from "../services/ProfileService";

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_ERROR = 'USER_ERROR';
export const USER_LOGOUT = 'USER_LOGOUT';

export const userLoadRequest = () => ({type: USER_REQUEST});
export const userLoadSuccess = (userData: User) => ({type: USER_SUCCESS, payload: userData});
export const userLoadError = () => ({type: USER_ERROR});

export const userLogoutAction = () => ({type: USER_LOGOUT});

export const loadUserByToken = () => async (dispatch: Dispatch<object>): Promise<any> => {
  dispatch(userLoadRequest());
  try {
    const response = await ProfileService.getProfile();
    dispatch(userLoadSuccess(response.data));
  } catch (e) {
    dispatch(userLoadError());
  }
};

