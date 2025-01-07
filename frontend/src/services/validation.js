import validationRules from "../shared/validationRules";

export const validateUsername = (username) => {
  if (!validationRules.username.regex.test(username)) {
    return validationRules.username.errorMessage;
  }
  return null;
};

export const validatePassword = (password) => {
  if (!validationRules.password.regex.test(password)) {
    return validationRules.password.errorMessage;
  }
  return null;
};
