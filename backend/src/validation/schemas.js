const customJoi = require("../utils/customJoi");

const schemas = {
  // ログイン用スキーマ
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

  // 登録用スキーマ
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

  // ユーザー名変更用スキーマ
  updateProfile: customJoi.object({
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
  }),

  updatePassword: customJoi.object({
    currentPassword: customJoi.string().required().messages({
      "any.required": "現在のパスワードは必須です。",
    }),
    password: customJoi
      .string()
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      .required()
      .messages({
        "string.pattern.base":
          "パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含める必要があります",
        "any.required": "新しいパスワードは必須です。",
      }),
  }),
};

module.exports = schemas;
