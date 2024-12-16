//backend/src/routes/v1/auth.js
// 認証関連のエンドポイント
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  verifyToken,
} = require("../../controllers/authController");

const { validate } = require("../../utils/validator");

// ミドルウェアをインポート
const authMiddleware = require("../../middlewares/authMiddleware");

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
