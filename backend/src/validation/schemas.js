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
    password: customJoi.string().min(8).required().messages({
      "string.min": "パスワードは8文字以上である必要があります",
      "any.required": "パスワードは必須です",
    }),
    confirmPassword: customJoi
      .string()
      .valid(customJoi.ref("password"))
      .required()
      .messages({
        "any.only": "パスワードが一致しません",
        "any.required": "確認用パスワードは必須です",
      }),
  }),

  updateProfile: customJoi.object({
    username: customJoi
      .string()
      .alphanumWithSymbols()
      .min(3)
      .max(30)
      .optional()
      .messages({
        "string.alphanumWithSymbols":
          "ユーザー名は英数字と一部の特殊文字のみ使用できます",
        "string.min": "ユーザー名は3文字以上である必要があります",
        "string.max": "ユーザー名は30文字以内である必要があります",
      }),
    password: customJoi
      .string()
      .min(8)
      .optional()
      .messages({ "string.min": "パスワードは8文字以上である必要があります" }),
  }),

  updatePassword: customJoi.object({
    currentPassword: customJoi.string().required().messages({
      "any.required": "現在のパスワードは必須です。",
    }),
    password: customJoi.string().min(8).required().messages({
      "string.min": "新しいパスワードは8文字以上である必要があります",
      "any.required": "新しいパスワードは必須です。",
    }),
  }),
};

module.exports = schemas;
