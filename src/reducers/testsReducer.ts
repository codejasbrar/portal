import {GET_TEST_SUCCESS, GET_TESTS_SUCCESS} from "../actions/testsActions";
import {OrdersState} from "./ordersReducer";
import {TestDetails} from "../interfaces/Test";

export interface TestsState extends OrdersState {
  details: TestDetails | null
}

const initialState: TestsState = {pending: [], approved: [], details: null};

export default (state: OrdersState = initialState, action: any) => {
  switch (action.type) {
    case GET_TESTS_SUCCESS:
      return {
        pending: action.status === "PENDING" ? action.payload : state.pending,
        approved: action.status === "APPROVED" ? action.payload : state.approved
      };
    case GET_TEST_SUCCESS:
      return {
        ...state,
        details: action.payload
      };
    default:
      return state;
  }
};
