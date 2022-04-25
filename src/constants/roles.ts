import {Role, RolesPermissions} from "../interfaces/User";

export const roles: Role[] = ['USER', 'ADMIN', 'PHYSICIAN', 'CUSTOMER_SUCCESS', 'SERVICE', 'SCARLET_PARTNER'];

const rolesPermissions: RolesPermissions = {
  'ADMIN': {
    approvePending: true,
    approveIncomplete: true,
    viewIncomplete: true,
    createLabslip: true,
  },
  'CUSTOMER_SUCCESS': {
    approvePending: false,
    approveIncomplete: true,
    viewIncomplete: true,
    createLabslip: true,
  },
  'PHYSICIAN': {
    approvePending: true,
    approveIncomplete: false,
    viewIncomplete: false,
    createLabslip: false,
  },
  'USER': {
    approvePending: false,
    approveIncomplete: false,
    viewIncomplete: false,
    createLabslip: false,
  },
  'SERVICE': {
    approvePending: false,
    approveIncomplete: false,
    viewIncomplete: true,
    createLabslip: true,
  },
  'SCARLET_PARTNER': {
    approvePending: false,
    approveIncomplete: false,
    viewIncomplete: false,
    createLabslip: false,
  }
};

export default rolesPermissions;
