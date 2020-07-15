import {GET_TEST_SUCCESS, GET_TESTS_BY_STATUS, GET_TESTS_ERROR, GET_TESTS_SUCCESS} from "../actions/testsActions";
import {OrdersState} from "./ordersReducer";
import {TestDetails} from "../interfaces/Test";
import {Order} from "../interfaces/Order";

export interface TestsState extends OrdersState {
  details: TestDetails | null,
  incomplete: { content: Order[] }
}

const initialState: TestsState = {
  pending: {content: []},
  approved: {content: []},
  details: null,
  incomplete: {content: []}
};

export default (state: TestsState = initialState, action: any) => {
  switch (action.type) {
    case GET_TESTS_SUCCESS:
      return {
        pending: action.status === "PENDING" ? action.payload : state.pending.content,
        approved: action.status === "APPROVED" ? action.payload : state.approved.content,
        incomplete: action.status === "INCOMPLETE" ? action.payload : state.incomplete.content
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
