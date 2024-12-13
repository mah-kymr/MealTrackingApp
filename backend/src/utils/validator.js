const Joi = require("joi");

const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
      "string.alphanum": "ユーザー名は英数字のみ使用できます",
      "string.min": "ユーザー名は3文字以上である必要があります",
      "string.max": "ユーザー名は30文字以内である必要があります",
    }),
    password: Joi.string()
      .pattern(
        new RegExp(
          process.env.PASSWORD_PATTERN ||
            "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[\\@\\$\\!\\%\\*\\#\\?\\&])[A-Za-z\\d\\@\\$\\!\\%\\*\\#\\?\\&]{8,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含める必要があります",
      }),
    // email: Joi.string().email().required(),
  }),
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional().messages({
      "string.alphanum": "ユーザー名は英数字のみ使用できます",
      "string.min": "ユーザー名は3文字以上である必要があります",
      "string.max": "ユーザー名は30文字以内である必要があります",
    }),
    // email: Joi.string().email().optional().messages({
    //   "string.email": "有効なメールアドレスを入力してください",
    // }),
    password: Joi.string()
      .pattern(
        new RegExp(
          process.env.PASSWORD_PATTERN ||
            "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[\\@\\$\\!\\%\\*\\#\\?\\&])[A-Za-z\\d\\@\\$\\!\\%\\*\\#\\?\\&]{8,}$"
        )
      )
      .optional()
      .messages({
        "string.pattern.base":
          "パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含める必要があります",
      }),
  }),
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schemas[schema].validate(req.body, { abortEarly: false });
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
