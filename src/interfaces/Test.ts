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

export interface LabPanel {
  id: number,
  code: string,
  name: string,
  laboratoryId: number,
  biomarkers: Biomarker[]
}

export type PlanPanel = {
  id: number,
  code: string,
  name: string,
  prettyName?: string,
  labPanels?: LabPanel[]
};

export interface Lab {
  id: number,
  name: string,
  fastingTemplateName: string,
  noFastingTemplateName: string,
  accountNumber: string,
  accountName: string
}

export interface LabWithPlanPanels {
  id: number,
  name: string,
  planPanels: PlanPanel[]
}
