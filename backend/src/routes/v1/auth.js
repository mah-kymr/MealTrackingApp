//backend/src/routes/v1/auth.js
// 認証関連のエンドポイント・認証が必要なエンドポイントでauthMiddlewareを使用する

const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const validate = require("../../middlewares/validationMiddleware");
const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../../controllers/authController");

// ユーザー登録エンドポイント（認証不要）
router.post("/register", validate("register"), register);

// ログインエンドポイント（認証不要）
router.post("/login", validate("login"), login);

// ログアウトエンドポイント
router.post("/logout", logout);

// プロファイル取得エンドポイント（認証が必要）
router.get("/profile", authMiddleware, getProfile);

// プロファイル更新エンドポイント（認証が必要）
router.put(
  "/profile",
  authMiddleware,
  validate("updateProfile"),
  updateProfile
);

// プロファイル削除エンドポイント
router.delete("/delete", authMiddleware, deleteAccount);

// トークン検証エンドポイント
router.get("/verify", authMiddleware, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "トークンは有効です。",
    user: {
      user_id: req.user.user_id,
      username: req.user.username,
    },
  });
});

module.exports = router;
