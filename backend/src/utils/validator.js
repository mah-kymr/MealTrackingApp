const Joi = require("joi");

// Joiの拡張機能を使用して、カスタムメソッドを追加
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
        const regex = /^[A-Za-z0-9@$!%*#?&]+$/; // 英数字と一部の特殊文字
        if (!regex.test(value)) {
          return helpers.error("string.alphanumWithSymbols");
        }
        return value;
      },
    },
  },
}));

// 環境変数から、またはデフォルト値でパスワードパターンを設定
const PASSWORD_PATTERN =
  process.env.PASSWORD_PATTERN ||
  "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[\\@\\$\\!\\%\\*\\#\\?\\&])[A-Za-z\\d\\@\\$\\!\\%\\*\\#\\?\\&]{8,}$";

const schemas = {
  register: customJoi.object({
    username: customJoi.string().alphanumWithSymbols().min(3).max(30).required().messages({
      "string.alphanum": "ユーザー名は英数字のみ使用できます",
      "string.min": "ユーザー名は3文字以上である必要があります",
      "string.max": "ユーザー名は30文字以内である必要があります",
      "any.required": "ユーザー名は必須です",
    }),
    password: customJoi.string()
      .pattern(new RegExp(PASSWORD_PATTERN))
      .required()
      .messages({
        "string.pattern.base":
          "パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含める必要があります",
        "any.required": "ユーザー名は必須です",
      }),
    // オプションでemailフィールドを追加可能
    // email: customJoi.string()
    // .email()
    // .optional()
    // .messages({
    //   "string.email": "有効なメールアドレスを入力してください"
    // })
  }),
  login: customJoi.object({
    username: customJoi.string()
      .required()
      .message({ "any.required": "ユーザー名は必須です" }),
    password: customJoi.string()
      .required()
      .message({ "any.required": "パスワードは必須です" }),
  }),

  updateProfile: customJoi.object({
    username: customJoi.string().alphanumWithSymbols().min(3).max(30).optional().messages({
      "string.alphanum": "ユーザー名は英数字のみ使用できます",
      "string.min": "ユーザー名は3文字以上である必要があります",
      "string.max": "ユーザー名は30文字以内である必要があります",
    }),
    password: customJoi.string()
      .pattern(new RegExp(process.env.PASSWORD_PATTERN))
      .optional()
      .message({
        "string.pattern.base":
          "パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含める必要があります",
      }),
  }),
};

const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
      return res.status(500).json({
        status: "error",
        errors: [{ message: "Invalid validation schema" }],
      });
    }

    const { error } = schema.validate(req.body, {
      abortEarly: false, // 全てのエラーを返す
      allowUnknown: true, // 追加のフィールドを許容
      stripUnknown: true, // 未定義のフィールドを削除
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));

      return res.status(400).json({ status: "error", errors });
    }

    next();
  };
};

module.exports = {
  validate,
  schemas,
};
