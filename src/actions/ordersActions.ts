import LabSlipApiService, {OrderStatus} from "../services/LabSlipApiService";
import {Order} from "../interfaces/Order";
import {Dispatch} from "react";
import {logOut, refreshTokenAction} from "./authActions";
import Token from "../helpers/localToken";
import {loadCounters} from "./countersActions";

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

export const loadOrdersByStatus = (status: OrderStatus, page: number, sortParam?: string, sortDirection?: 'asc' | 'desc', searchString?: string) => async (dispatch: Dispatch<object>): Promise<any> => {
  dispatch(loadOrdersRequest());
  try {
    const response = await LabSlipApiService.getOrdersByStatus(status, page, sortParam || '', sortDirection || 'desc', searchString || '');
    dispatch(loadOrdersSuccess(response, status))
  } catch (exception) {
    await catchBlock(exception, dispatch);
  }
};

export const saveOrders = (hashes: string[]) => async (dispatch: Dispatch<object>): Promise<any> => {
  try {
    await LabSlipApiService.saveApprovedOrders(hashes);
    await dispatch(loadCounters());
  } catch (exception) {
    await catchBlock(exception, dispatch);
  }
};

export const catchBlock = async (exception: any, dispatch: Dispatch<any>): Promise<any> => {
  const errorData = exception.response;
  if (errorData && (errorData.status === 403 || errorData.message === "Unauthorized" || errorData.status === 401)) {
    try {
      await dispatch(refreshTokenAction(Token.get().refreshToken as string));
    } catch (e) {
      dispatch(logOut());
    }
  } else {
    dispatch(loadOrdersError())
  }
};