const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const validate = require("../../middlewares/validationMiddleware");
const { recordMeal } = require("../../controllers/mealController");

// 食事記録API
router.post(
  "/",
  authMiddleware,
  validate("mealRecord"),
  (req, res, next) => {
    console.log("Passed authentication and validation");
    next();
  },
  recordMeal
);

module.exports = router;
