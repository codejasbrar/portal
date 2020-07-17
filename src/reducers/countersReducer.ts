import {OrdersQuantity} from "../interfaces/Order";
import {GET_COUNTERS_ERROR, GET_COUNTERS_REQUEST, GET_COUNTERS_SUCCESS} from "../actions/countersActions";


const initialState: OrdersQuantity | {} = {};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case GET_COUNTERS_REQUEST:
      return state;
    case GET_COUNTERS_SUCCESS:
      return action.payload;
    case GET_COUNTERS_ERROR:
      return state;
    default:
      return state;
  }
};