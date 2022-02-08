export type Role = 'USER' | 'ADMIN' | 'PHYSICIAN' | 'CUSTOMER_SUCCESS' | 'SERVICE';

export type RolesPermissions = {
  [key in Role]: {
    approvePending: boolean;
    approveIncomplete: boolean;
    viewIncomplete: boolean;
    createLabslip: boolean;
  };
};

export interface User {
  id: number,
  email: string,
  active: boolean,
  skip2fa: boolean,
  physician: Physician | null,
  roles: Role[]
}

export interface PhysicianRequestInfoDto {
  prefix?: string,
  firstName: string,
  middleName?: string,
  secondName: string,
  postfix?: string,
  npi?: string,
  phone: string,
  states?: string[]
}

export interface UserRequestInfoDto {
  email: string,
  password: string,
  physician: PhysicianRequestInfoDto | null,
  skip2fa: boolean,
  roles: Role[]
}

export interface Physician {
  id: number,
  prefix?: string,
  firstName: string,
  middleName?: string,
  secondName: string,
  postfix?: string,
  phone: string,
  npi?: string;
  states?: string[];
}
