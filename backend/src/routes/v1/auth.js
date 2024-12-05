//backend/src/routes/v1/auth.js
// 認証関連のエンドポイント
const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../../controllers/authController");
// ミドルウェアをインポート
const authMiddleware = require("../../middlewares/authMiddleware");
const { default: CompletePage } = require("../../../../frontend/src/pages/CompletePage");

// ユーザー登録エンドポイント（認証不要）
router.post("/register", register);

// ログインエンドポイント（認証不要）
router.post("/login", login);

// ログアウトエンドポイント
router.post("/logout", logout);

// 認証が必要なユーザープロファイルエンドポイント
router.get("/profile", authMiddleware, (req, res) => {
  try {
    res.status(200).json({
      user_id: req.user.user_id, // JWTでデコードされたユーザー情報
      username: req.user.username,
      message: "User profile fetched successfully",
    });
  } catch (error) {
    // エラー時も適切なJSONレスポンスを返す
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

module.exports = router;
