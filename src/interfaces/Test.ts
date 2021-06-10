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
  hash: string,
  commentsExist?: boolean
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

export interface Biomarker {
  id: number,
  name: string,
  abbr: string,
  value: number,
  minPanicValue: number,
  maxPanicValue: number,
  units: string,
  addOn: boolean
}

export type Panel = {
  id: number,
  code: number,
  name: string,
  prettyName?: string,
  labPanels?: Panel[]
  biomarkers?: Biomarker[],
};
