export interface User {
  id: number,
  email: string,
  active: boolean,
  skip2fa: boolean,
  physician: Physician
}

export interface Physician {
  prefix: string,
  firstName: string,
  middleName: string,
  secondName: string,
  postfix: string,
  phone: string
}
