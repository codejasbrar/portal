export type Role = 'USER' | 'ADMIN' | 'PHYSICIAN' | 'CUSTOMER_SUCCESS';

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
  physician: Physician,
  roles: Role[]
}

export interface Physician {
  prefix: string,
  firstName: string,
  middleName: string,
  secondName: string,
  postfix: string,
  phone: string
}
