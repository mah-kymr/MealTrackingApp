const Joi = require("joi");

// Joiを拡張するカスタム設定
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

module.exports = customJoi;
