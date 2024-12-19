const schemas = require("../validation/schemas");

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

module.exports = validate;
