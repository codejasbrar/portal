import LabSlipApiService, {OrderStatus} from "../services/LabSlipApiService";
import {Order} from "../interfaces/Order";
import {Dispatch} from "react";
import {logOut, refreshTokenAction} from "./authActions";
import Token from "../helpers/localToken";

export const GET_ORDERS_BY_STATUS = 'GET_ORDERS_BY_STATUS';
export const GET_ORDERS_SUCCESS = 'GET_ORDERS_SUCCESS';
export const GET_ORDERS_ERROR = 'GET_ORDERS_ERROR';

export const loadOrdersRequest = () => ({type: GET_ORDERS_BY_STATUS});
export const loadOrdersSuccess = (orders: Order[], status: OrderStatus) => ({
  type: GET_ORDERS_SUCCESS,
  payload: orders,
  status
});
export const loadOrdersError = () => ({type: GET_ORDERS_ERROR});

export const loadOrdersByStatus = (status: OrderStatus) => async (dispatch: Dispatch<object>): Promise<any> => {
  dispatch(loadOrdersRequest());
  try {
    const response = await LabSlipApiService.getOrdersByStatus(status);
    dispatch(loadOrdersSuccess(response.data, status))
  } catch (exception) {
    const errorData = exception.response;
    if (errorData.status === 403 || errorData.message === "Unauthorized" || errorData.status === 401) {
      try {
        dispatch(refreshTokenAction(Token.get().refreshToken as string));
      } catch (e) {
        dispatch(logOut());
      }
    } else {
      dispatch(loadOrdersError())
    }
  }
};