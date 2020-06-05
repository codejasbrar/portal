type FieldObject = {
  name: string,
  type: "email" | "password" | "text",
  value: string
}

type ValidationResult = {
  message: string,
  valid: boolean
};

const ValidateFields = (fieldsArray: FieldObject[]): ValidationResult => {
  let valid = true;
  let message = '';
  fieldsArray.reverse().forEach((field: FieldObject) => {
    if (!field.value.length) {
      message = `${field.name} can't be empty`;
      valid = false;
    } else {
      switch (field.type) {
        case "email":
          if (!isValidEmail(field.value)) {
            message = "Email is not valid";
            valid = false;
          }
          break;
        case "password":
          if (field.value.length < 8) {
            message = "Minimum 8 characters in password";
            valid = false;
          } else if (!isValidPassword(field.value)) {
            message = "Must contain at least one number and one letter";
            valid = false;
          }
          break;
        default:
          break;
      }
    }
  });
  return {
    message,
    valid
  }
};

export default ValidateFields;


const isValidPassword = (pass: string): boolean => {
  return (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\-@#!?%*^<>&$~±§]{8,}$/).test(pass); //Minimum eight characters, at least one letter and one number:
};

const isValidEmail = (email: string) => {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email);
};