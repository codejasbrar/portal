import {GET_TESTS_BY_STATUS, GET_TESTS_ERROR, GET_TESTS_SUCCESS} from "../actions/testsActions";
import {Test} from "../interfaces/Test";

const initialState: Test[] = [];

export default (state: Test[] = initialState, action: any) => {
  switch (action.type) {
    case GET_TESTS_BY_STATUS:
      return state;
    case GET_TESTS_SUCCESS:
      return [...state, ...action.payload];
    case GET_TESTS_ERROR:
      return state;
    default:
      return state;
  }
};
