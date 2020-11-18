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
  planVariantName: string,
  planVariantPrettyName: string,
  markers: string[],
  fasting: boolean,
  status: TestStatus
  packageId: number
}

interface Pageable {
  offset: number,
  pageNumber: number,
  pageSize: number,
  paged: boolean
  sort: Sort
}

interface Sort {
  empty: boolean,
  sorted: boolean,
  unsorted: boolean
}

export interface OrdersResponse {
  content: Order[],
  empty: boolean,
  first: boolean,
  last: boolean,
  number: number,
  numberOfElements: number,
  pageable: Pageable,
  size: number,
  sort: Sort,
  totalElements: number,
  totalPages: number
}

export interface OrdersQuantity {
  pendingOrders: number,
  approvedOrders: number,
  incompleteResults: number,
  pendingResults: number,
  approvedResults: number
}