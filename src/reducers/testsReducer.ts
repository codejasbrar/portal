import {GET_TESTS_BY_STATUS, GET_TESTS_ERROR, GET_TESTS_SUCCESS} from "../actions/testsActions";
import {OrdersState} from "./ordersReducer";

const initialState: OrdersState = {pending: [], approved: []};

export default (state: OrdersState = initialState, action: any) => {
  switch (action.type) {
    case GET_TESTS_BY_STATUS:
      return state;
    case GET_TESTS_SUCCESS:
      return {
        pending: action.status === "PENDING" ? action.payload : state.pending,
        approved: action.status === "APPROVED" ? action.payload : state.approved
      };
    case GET_TESTS_ERROR:
      return state;
    default:
      return state;
  }
};
