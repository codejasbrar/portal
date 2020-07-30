import {Dispatch} from "react";
import LabSlipApiService from "../services/LabSlipApiService";
import {catchBlock} from "./ordersActions";
import {OrdersQuantity} from "../interfaces/Order";

export const GET_COUNTERS_REQUEST = 'GET_COUNTERS_REQUEST';
export const GET_COUNTERS_SUCCESS = 'GET_COUNTERS_SUCCESS';
export const GET_COUNTERS_ERROR = 'GET_COUNTERS_ERROR';


export const getCountersSuccess = (counters: OrdersQuantity) => ({type: GET_COUNTERS_SUCCESS, payload: counters});

export const loadCounters = () => async (dispatch: Dispatch<object>): Promise<any> => {
  try {
    const response = await LabSlipApiService.getQuantity();
    dispatch(getCountersSuccess(response.data));
  } catch (e) {
    await catchBlock(e, dispatch);
  }
};