import { validationRules } from "../shared/validationRules";

export const validatePassword = (password) => {
  if (!validationRules.password.regex.test(password)) {
    return validationRules.password.errorMessage;
  }
  return null;
};
