import {GET_ORDERS_BY_STATUS, GET_ORDERS_ERROR, GET_ORDERS_SUCCESS} from "../actions/ordersActions";
import {OrdersResponse} from "../interfaces/Order";

export type OrdersState = {
  pending: OrdersResponse | {}, approved: OrdersResponse | {}
}

const initialState: OrdersState = {pending: {}, approved: {}};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case GET_ORDERS_BY_STATUS:
      return state;
    case GET_ORDERS_SUCCESS:
      return {
        pending: action.status === "PENDING" ? action.payload : state.pending,
        approved: action.status === "APPROVED" ? action.payload : state.approved
      };
    case GET_ORDERS_ERROR:
      return state;
    default:
      return state;
  }
};