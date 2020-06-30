import LabSlipApiService, {TestStatus} from "../services/LabSlipApiService";
import {Test} from "../interfaces/Test";
import {Dispatch} from "react";
import {logOut, refreshTokenAction} from "./authActions";
import Token from "../helpers/localToken";

export const GET_TESTS_BY_STATUS = 'GET_TESTS_BY_STATUS';
export const GET_TESTS_SUCCESS = 'GET_TESTS_SUCCESS';
export const GET_TESTS_ERROR = 'GET_TESTS_ERROR';

export const loadTestsRequest = () => ({type: GET_TESTS_BY_STATUS});
export const loadTestsSuccess = (tests: Test[], status: TestStatus) => ({
  type: GET_TESTS_SUCCESS,
  payload: tests,
  status
});
export const loadTestsError = () => ({type: GET_TESTS_ERROR});

export const loadTestsByStatus = (status: TestStatus) => async (dispatch: Dispatch<object>): Promise<any> => {
  dispatch(loadTestsRequest());
  try {
    const response = await LabSlipApiService.getResultsByStatus(status);
    dispatch(loadTestsSuccess(response.data, status))
  } catch (exception) {
    const errorData = exception.response;
    if (errorData.status === 403 || errorData.message === "Unauthorized" || errorData.status === 401) {
      try {
        dispatch(refreshTokenAction(Token.get().refreshToken as string));
      } catch (e) {
        dispatch(logOut());
      }
    } else {
      dispatch(loadTestsError())
    }
  }
};
