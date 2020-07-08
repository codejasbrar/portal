import {Test} from "./Test";
import {TestStatus} from "../services/LabSlipApiService";

export interface Order extends Test {
  id: number,
  received: string,
  approved: string,
  customerId: number,
  criteriaMet: boolean | "Yes" | "No",
  hash: string
}

export interface OrderDetails {
  id: number,
  customerId: number,
  customerFirstName: string,
  customerLastName: string,
  customerGender: string,
  customerDateOfBirth: string,
  customerPhone: string,
  addrState: string,
  addrCity: string,
  addrZipCode: number,
  addressLine1: string,
  addressLine2: string,
  panelCode: number,
  planName: string,
  markers: string[],
  fasting: boolean,
  status: TestStatus
}