import LabSlipApiService, {OrderStatus} from "../services/LabSlipApiService";
import {Order} from "../interfaces/Order";
import {Dispatch} from "react";
import {logOut} from "./authActions";

export const GET_ORDERS_BY_STATUS = 'GET_ORDERS_BY_STATUS';
export const GET_ORDERS_SUCCESS = 'GET_ORDERS_SUCCESS';
export const GET_ORDERS_ERROR = 'GET_ORDERS_ERROR';

export const loadOrdersRequest = () => ({type: GET_ORDERS_BY_STATUS});
export const loadOrdersSuccess = (orders: Order[]) => ({type: GET_ORDERS_SUCCESS, payload: orders});
export const loadOrdersError = (error: Error) => ({type: GET_ORDERS_ERROR, payload: error});

export const loadOrdersByStatus = (status: OrderStatus) => async (dispatch: Dispatch<object>): Promise<any> => {
  dispatch(loadOrdersRequest());
  try {
    const response = await LabSlipApiService.getOrdersByStatus(status);
    dispatch(loadOrdersSuccess(response.data))
  } catch (exception) {
    const errorData = exception.response.data;
    if (errorData.status === 403 || errorData.message === "Unauthorized") {
      dispatch(logOut());
    } else {
      dispatch(loadOrdersError(errorData))
    }
  }
};