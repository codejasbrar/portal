import {USER_ERROR, USER_LOGOUT, USER_REQUEST, USER_SUCCESS} from "../actions/userActions";
import {UserActionsTypes} from "../interfaces/User";

const initialState: object = {};

export default (state = initialState, action: UserActionsTypes) => {
  switch (action.type) {
    case USER_REQUEST:
      return state;
    case USER_SUCCESS:
      return action.payload;
    case USER_ERROR:
      return new Error();
    case USER_LOGOUT:
      return {};
    default:
      return state
  }
};