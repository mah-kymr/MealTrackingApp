const customJoi = require("../utils/customJoi");

const schemas = {
  login: customJoi.object({
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
    password: customJoi.string().min(8).required().messages({
      "string.min": "パスワードは8文字以上である必要があります",
      "any.required": "パスワードは必須です",
    }),
  }),
};

module.exports = schemas;
