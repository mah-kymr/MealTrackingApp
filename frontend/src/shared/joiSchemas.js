import Joi from "joi";
import validationRules from "./validationRules";

const customJoi = Joi.extend((joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.alphanumWithSymbols":
      "{{#label}} は英数字と一部の特殊文字のみ使用できます",
  },
  rules: {
    alphanumWithSymbols: {
      validate(value, helpers) {
        if (!validationRules.username.regex.test(value)) {
          return helpers.error("string.alphanumWithSymbols");
        }
        return value;
      },
    },
  },
}));

const schemas = {
  updateProfile: customJoi.object({
    username: customJoi
      .string()
      .alphanumWithSymbols()
      .min(validationRules.username.minLength)
      .max(validationRules.username.maxLength)
      .optional(),
    password: customJoi
      .string()
      .min(validationRules.password.minLength)
      .optional(),
  }),
};

export default schemas;
