import {RolesPermissions} from "../interfaces/User";

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
  }
};

export default rolesPermissions;