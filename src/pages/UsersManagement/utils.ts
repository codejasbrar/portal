import {Role} from "../../interfaces/User";

export const getInitialErrors = () => ({
  email: '',
  password: '',
  confirmPassword: '',
  'physician.prefix': '',
  'physician.firstName': '',
  'physician.middleName': '',
  'physician.secondName': '',
  'physician.postfix': '',
  'physician.npi': '',
  'physician.phone': '',
  'physician.states': '',
  skip2fa: '',
  roles: ''
});

export const getInitialUserForm = () => ({
  email: '',
  password: '',
  confirmPassword: '',
  isPhysician: true,
  skip2fa: false,
  roles: [] as Role[]
});

export const getInitialPhysicianForm = () => ({
  prefix: '',
  firstName: '',
  middleName: '',
  secondName: '',
  postfix: '',
  npi: '',
  phone: ''
});

export const camelToWords = (str: string) => {
  const arr = str.split(/([A-Z])/);
  let result = '';
  for (let i = 0; i < arr.length; i += 2) {
    result += arr[i];
    if (arr[i + 1]) {
      result += ` ${arr[i + 1]}`;
    }
  }

  return result[0].toUpperCase() + result.slice(1);
}

export type UserForm = ReturnType<typeof getInitialUserForm>;
export type PhysicianForm = ReturnType<typeof getInitialPhysicianForm>;
