const customJoi = require("../utils/customJoi");

const PASSWORD_PATTERN =
  process.env.PASSWORD_PATTERN ||
  "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";

const schemas = {
  register: customJoi.object({
    username: customJoi
      .string()
      .alphanumWithSymbols()
      .min(3)
      .max(30)
      .required()
      .messages({
        "string.alphanumWithSymbols":
          "ユーザー名は英数字と一部の特殊文字のみ使用できます",
        "string.min": "ユーザー名は3文字以上である必要があります",
        "string.max": "ユーザー名は30文字以内である必要があります",
        "any.required": "ユーザー名は必須です",
      }),
    password: customJoi
      .string()
      .pattern(new RegExp(PASSWORD_PATTERN))
      .required()
      .messages({
        "string.pattern.base":
          "パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含める必要があります",
        "any.required": "パスワードは必須です",
      }),
  }),

  login: customJoi.object({
    username: customJoi.string().required().messages({
      "any.required": "ユーザー名は必須です",
    }),
    password: customJoi.string().required().messages({
      "any.required": "パスワードは必須です",
    }),
  }),
};

module.exports = schemas;
