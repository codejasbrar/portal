import client from "./client";
import {Lab, LabPanel, LabWithPlanPanels, PlanPanel} from "../interfaces/Test";
import {AxiosResponse} from "axios";

export type OrderStatus = "PENDING" | "APPROVED" | "APPROVED_NOT_SENT" | "REJECTED";

export type TestStatus = "PENDING" | "APPROVED" | "APPROVED_NOT_SENT" | "REJECTED" | "INCOMPLETE";

export type SortDirection = 'asc' | 'desc';

export default class LabSlipApiService {
  static getOrdersByStatus = async (status: OrderStatus, page: number, sortParam?: string, sortDirection?: SortDirection, searchString?: string) =>
    await client.get(`/getOrdersByStatus/${status}?page=${page}&size=25&sort=${sortParam || 'received'},${sortDirection || 'desc'}&search=${searchString || ''}`)
      .then(response => response.data);

  static getAllOrders = async (searchString?: string) =>
    await client.get(`/getOrdersByStatus?search=${searchString || ''}&size=1000`)
      .then(response => response.data);

  static saveApprovedOrders = async (hashes: string[]) =>
    await client.post('/saveApprovedOrders', {hashes});

  static saveApprovedResults = async (hashes: string[]) =>
    await client.post('/saveApprovedResults', {hashes});

  static savePendingResults = async (hashes: string[]) =>
    await client.post('/savePendingResults', {hashes});

  static getResultsByStatus = async (status: TestStatus, page: number, sortParam?: string, sortDirection?: SortDirection, searchString?: string) =>
    await client.get(`/getResultsByStatus/${status}?page=${page}&size=25&sort=${sortParam || 'received'},${sortDirection || 'desc'}&search=${searchString || ''}`)
      .then(response => response.data);


  static getResult = async (hash: string) =>
    await client.get(`/getResult/${hash}`);

  static getQuantity = async () =>
    await client.get('/getOrdersAndResultsQuantity');

  static saveMessage = async (hash: string, message: string) =>
    await client.post(`/saveComment/${hash}`, {message});

  static getLabSlip = async (hash: string) =>
    await client.get(`/getLabSlip/${hash}`, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf'
      }
    });

  static getPlanPanels = async (): Promise<LabWithPlanPanels[]> =>
    await client.get(`/planPanels/list`)
      .then((response: AxiosResponse<LabWithPlanPanels[]>) => response.data.map(lab => ({
        ...lab,
        planPanels: lab.planPanels.map(planPanel => ({
          ...planPanel,
          code: planPanel.code || `${lab.id}-plan-${planPanel.id}`
        }))
      })));

  static getLabPanels = async (): Promise<LabPanel[]> =>
    await client.get(`/labPanels/list`)
      .then(response => response.data);

  static getLabs = async (): Promise<Lab[]> =>
    await client.get(`/partners/laboratories/list`)
      .then(response => response.data);

  static searchCustomer = async (searchString: string) =>
    await client.get(`/customers?search=${searchString}`)
      .then(response => response.data);

  static createOrder = async (lab: number, postData: object) =>
    await client.post(`/generateCustomLabSlip/${lab}`, {...postData}, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf'
      }
    })
}
