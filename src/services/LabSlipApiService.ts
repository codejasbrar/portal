import client, {authorized} from "./client";
import {AxiosResponse} from 'axios';

export type OrderStatus = "pending" | "approved" | "approved_not_sent" | "rejected";

export default class LabSlipApiService {
  static getOrdersByStatus = async (status: OrderStatus) => await authorized.get(`/getOrdersByStatus/${status}`).then(data => {
    console.log(data)
  });
}
// @ts-ignore
window.LabSlipApi = LabSlipApiService;
