import {OrderDetails} from "./Order";

export interface Test {
  id: number,
  received: string,
  approved: string,
  customerId: number,
  orderId: number,
  panicValueBiomarkers: string[],
  hash: string
}

export interface Biomarker {
  id: number,
  name: string,
  value: number,
  minPanicValue: number,
  maxPanicValue: number,
  units: string,
}

export interface TestDetails {
  id: number,
  received: string,
  approved: string | null,
  status: string,
  order: OrderDetails,
  biomarkers: Biomarker[]
}