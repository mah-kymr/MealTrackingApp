const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const validate = require("../../middlewares/validationMiddleware");
const {
  recordMeal,
  getMealHistory,
  getMealCategories,
  updateMealRecord,
  deleteMealRecord,
} = require("../../controllers/mealController");

// 認証を必要とするミドルウェア
router.use(authMiddleware);

// 食事記録API（新規記録）
router.post(
  "/",
  validate("mealRecord"),
  (req, res, next) => {
    console.log("✅ Passed authentication and validation");
    next();
  },
  recordMeal
);
// **記録一覧API（履歴取得）**
router.get("/history", getMealHistory);

// **カテゴリ一覧取得API**
router.get("/categories", getMealCategories);

// **記録編集API**
router.put(
  "/:record_id",
  authMiddleware,
  validate("mealRecord"),
  updateMealRecord
);

// **記録削除API**
router.delete("/:record_id", authMiddleware, deleteMealRecord);

module.exports = router;
