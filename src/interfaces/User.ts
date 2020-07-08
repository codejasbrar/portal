import {USER_ERROR, USER_REQUEST, USER_SUCCESS} from "../actions/userActions";

export interface User {
  id: number,
  email: string,
  active: boolean,
  skip2fa: boolean,
  physician: Physician
}

export interface Physician {
  prefix: string,
  firstName: string,
  middleName: string,
  secondName: string,
  postfix: string,
  phone: string
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
