//backend/src/routes/v1/auth.js
// 認証関連のエンドポイント
const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../../controllers/authController");
// ミドルウェアをインポート
const authMiddleware = require("../../middlewares/authMiddleware");

// ユーザー登録エンドポイント（認証不要）
router.post("/register", register);

// ログインエンドポイント（認証不要）
router.post("/login", login);

// ログアウトエンドポイント
router.post("/logout", logout);

// プロファイル取得エンドポイント（認証が必要）
router.get("/profile", authMiddleware, (req, res) => {
  // 必要最低限の情報を返す
  res.status(200).json({
    user_id: req.user.user_id,
    username: req.user.username,
    message: "ユーザープロファイルが正常に取得されました。",
  });
});

// トークン検証エンドポイント
router.get("/verify", authMiddleware, (req, res) => {
  res.status(200).json({ message: "トークンは有効です。", user: req.user });
});

module.exports = router;
