import client from "./client";
import Token from "../helpers/localToken";

export type OrderStatus = "PENDING" | "APPROVED" | "APPROVED_NOT_SENT" | "REJECTED";

export type TestStatus = "PENDING" | "APPROVED" | "APPROVED_NOT_SENT" | "REJECTED" | "INCOMPLETE";

export type SortDirection = 'asc' | 'desc';

export default class LabSlipApiService {
  static getOrdersByStatus = async (status: OrderStatus, page: number, sortParam?: string, sortDirection?: SortDirection) => await client.get(`/getOrdersByStatus/${status}?page=${page}&size=25&sort=${sortParam || 'received'},${sortDirection || 'desc'}`, {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  }).then(response => response.data);

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

  static getResultsByStatus = async (status: TestStatus, page: number, sortParam?: string, sortDirection?: SortDirection) => await client.get(`/getResultsByStatus/${status}?page=${page}&size=25&sort=${sortParam || 'received'},${sortDirection || 'desc'}`, {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  }).then(response => response.data);


  static getResult = async (hash: string) => await client.get(`/getResult/${hash}`, {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  });

  static getQuantity = async () => await client.get('/getOrdersAndResultsQuantity', {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  });

  static saveMessage = async (hash: string, message: string) => await client.post(`/saveComment/${hash}`, {message}, {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  });

  static getLabSlip = async (hash: string) => await client.get(`/getLabSlip/Quest/${hash}`, {
    responseType: 'arraybuffer',
    headers: {
      'Authorization': `Bearer ${Token.get().token}`,
      'Accept': 'application/pdf'
    }
  });
}
