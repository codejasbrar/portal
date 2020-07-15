import {GET_ORDERS_BY_STATUS, GET_ORDERS_ERROR, GET_ORDERS_SUCCESS} from "../actions/ordersActions";
import {Order} from "../interfaces/Order";

export type OrdersState = {
  pending: { content: Order[] }, approved: { content: Order[] }
}

const initialState: OrdersState = {pending: {content: []}, approved: {content: []}};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case GET_ORDERS_BY_STATUS:
      return state;
    case GET_ORDERS_SUCCESS:
      return {
        pending: action.status === "PENDING" ? action.payload : state.pending.content,
        approved: action.status === "APPROVED" ? action.payload : state.approved.content
      };
    case GET_ORDERS_ERROR:
      return state;
    default:
      return state;
  }
};