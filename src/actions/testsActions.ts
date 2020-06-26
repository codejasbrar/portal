import LabSlipApiService, {TestStatus} from "../services/LabSlipApiService";
import {Test} from "../interfaces/Test";
import {Dispatch} from "react";
import {logOut} from "./authActions";

export const GET_TESTS_BY_STATUS = 'GET_TESTS_BY_STATUS';
export const GET_TESTS_SUCCESS = 'GET_TESTS_SUCCESS';
export const GET_TESTS_ERROR = 'GET_TESTS_ERROR';

export const loadTestsRequest = () => ({type: GET_TESTS_BY_STATUS});
export const loadTestsSuccess = (tests: Test[]) => ({type: GET_TESTS_SUCCESS, payload: tests});
export const loadTestsError = (error: Error) => ({type: GET_TESTS_ERROR, payload: error});

export const loadTestsByStatus = (status: TestStatus) => async (dispatch: Dispatch<object>): Promise<any> => {
  dispatch(loadTestsRequest());
  await LabSlipApiService.getTestsByStatus(status).then((response) => {
    dispatch(loadTestsSuccess(response.data))
  }).catch((error) => {
    const errorData = error.response.data;
    if (errorData.status === 403 || errorData.message === "Unauthorized") {
      dispatch(logOut());
    } else {
      dispatch(loadTestsError(errorData))
    }
  })
};
