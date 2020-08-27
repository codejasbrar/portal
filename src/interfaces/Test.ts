import {OrderDetails} from "./Order";
import {User} from "./User";

export interface Test {
  id: number,
  received: string,
  approved: string,
  observed: string,
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

export interface TestComment {
  message: string,
  id: number,
  user: User,
  sent: string
}

export interface TestDetails {
  id: number,
  received: string,
  approved: string | null,
  observed: string,
  status: string,
  order: OrderDetails,
  biomarkers: Biomarker[],
  testResultComments: TestComment[],
  criteriaMet?: boolean | 'Yes' | 'No'
}