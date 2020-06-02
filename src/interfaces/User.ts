import {USER_ERROR, USER_REQUEST, USER_SUCCESS} from "../actions/userActions";

export interface User {
  first_name: string,
  last_name: string,
}

interface UserRequestAction {
  type: typeof USER_REQUEST
}

interface UserSuccessAction {
  type: typeof USER_SUCCESS,
  payload: User
}

interface UserErrorAction {
  type: typeof USER_ERROR,
  payload: Error
}

export type UserActionsTypes = UserRequestAction & UserSuccessAction & UserErrorAction;
