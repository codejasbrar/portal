import client from "./client";
import Token from "../helpers/localToken";

export type OrderStatus = "PENDING" | "APPROVED" | "APPROVED_NOT_SENT" | "REJECTED";

export type TestStatus = "PENDING" | "APPROVED" | "APPROVED_NOT_SENT" | "REJECTED" | "INCOMPLETE";

export default class LabSlipApiService {
  static getOrdersByStatus = async (status: OrderStatus) => await client.get(`/getOrdersByStatus/${status}`, {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  }).then(data => data);

  static saveApprovedOrders = async (hashes: string[]) => await client.post('/saveApprovedOrders', {hashes}, {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  });

  static saveApprovedResults = async (hashes: string[]) => await client.post('/saveApprovedResults', {hashes}, {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  });

  static savePendingResults = async (hashes: string[]) => await client.post('/savePendingResults', {hashes}, {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  });

  static getResultsByStatus = async (status: TestStatus) => await client.get(`/getResultsByStatus/${status}`, {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  }).then(data => data);


  static getResult = async (hash: string) => await client.get(`/getResult/${hash}`, {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  });
}
