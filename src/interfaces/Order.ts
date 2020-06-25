export interface Order {
  id: number,
  received: string,
  approved: string,
  customerId: number,
  criteriaMet: boolean,
  hash: string
}