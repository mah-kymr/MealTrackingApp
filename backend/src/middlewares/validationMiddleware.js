const schemas = require("../validation/schemas");

const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
      console.error("Validation schema not found:", schemaName);
      return res.status(500).json({
        status: "error",
        errors: [{ message: "Invalid validation schema" }],
      });
    }

    // Joiバリデーションの実行
    const validationResult = schema.validate(req.body, { abortEarly: false });

    // エラーチェック
    if (validationResult.error) {
      console.error(
        "Validation error details:",
        validationResult.error.details
      );
      return res.status(400).json({
        status: "error",
        errors: validationResult.error.details.map((detail) => ({
          field: detail.path[0],
          message: detail.message,
        })),
      });
    }

    next();
  };
};

module.exports = validate;
