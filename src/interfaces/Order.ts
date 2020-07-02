import {Test} from "./Test";

export interface Order extends Test {
  id: number,
  received: string,
  approved: string,
  customerId: number,
  criteriaMet: boolean | "Yes" | "No",
  hash: string
}