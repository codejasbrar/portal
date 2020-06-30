import {authorized} from "./client";
import {AxiosResponse} from 'axios';

export type OrderStatus = "PENDING" | "APPROVED" | "APPROVED_NOT_SENT" | "REJECTED";

export type TestStatus = "PENDING" | "APPROVED" | "APPROVED_NOT_SENT" | "REJECTED";

export default class LabSlipApiService {
  static getOrdersByStatus = async (status: OrderStatus) => await authorized.get(`/getOrdersByStatus/${status}`).then(data => data);
  static saveApprovedOrders = async (hashes: string[]) => await authorized.post('/saveApprovedOrders', {hashes});

  static getTestsByStatus = async (status: TestStatus) => await authorized.get(`/getResultsByStatus/${status}`).then(data => data);

  static saveApprovedResults = async (hashes: string[]) => await authorized.post('/saveApprovedResults', {hashes})
}
