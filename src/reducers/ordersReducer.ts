import {GET_ORDERS_BY_STATUS, GET_ORDERS_ERROR, GET_ORDERS_SUCCESS} from "../actions/ordersActions";
import {Order} from "../interfaces/Order";

const initialState: Order[] = [];

export default (state: Order[] = initialState, action: any) => {
  switch (action.type) {
    case GET_ORDERS_BY_STATUS:
      return state;
    case GET_ORDERS_SUCCESS:
      return [...state, ...action.payload];
    case GET_ORDERS_ERROR:
      return state;
    default:
      return state;
  }
};