import LabSlipApiService, {TestStatus} from "../services/LabSlipApiService";
import {Test, TestDetails} from "../interfaces/Test";
import {Dispatch} from "react";
import {catchBlock} from "./ordersActions";

export const GET_TESTS_BY_STATUS = 'GET_TESTS_BY_STATUS';
export const GET_TESTS_SUCCESS = 'GET_TESTS_SUCCESS';
export const GET_TESTS_ERROR = 'GET_TESTS_ERROR';

export const GET_TEST_REQUEST = 'GET_TEST_REQUEST';
export const GET_TEST_SUCCESS = 'GET_TEST_SUCCESS';

export const loadTestsRequest = () => ({type: GET_TESTS_BY_STATUS});
export const loadTestsSuccess = (tests: Test[], status: TestStatus) => ({
  type: GET_TESTS_SUCCESS,
  payload: tests,
  status
});

export const getTestRequest = () => ({type: GET_TEST_REQUEST});
export const getTestSuccess = (test: TestDetails) => ({type: GET_TEST_SUCCESS, payload: test});

export const loadTestsByStatus = (status: TestStatus) => async (dispatch: Dispatch<object>): Promise<any> => {
  dispatch(loadTestsRequest());
  try {
    const response = await LabSlipApiService.getResultsByStatus(status);
    dispatch(loadTestsSuccess(response.data, status))
  } catch (exception) {
    await catchBlock(exception, dispatch);
  }
};

export const saveResults = (hashes: string[]) => async (dispatch: Dispatch<object>): Promise<any> => {
  try {
    await LabSlipApiService.saveApprovedResults(hashes);
  } catch (exception) {
    await catchBlock(exception, dispatch);
  }
};

export const getResult = (hash: string) => async (dispatch: Dispatch<object>): Promise<any> => {
  dispatch(getTestRequest());
  try {
    const response = await LabSlipApiService.getResult(hash);
    dispatch(getTestSuccess(response.data));
  } catch (e) {
    await catchBlock(e, dispatch)
  }
};
