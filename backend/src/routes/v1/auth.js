// 認証関連のエンドポイント

const express = require("express");
const router = express.Router();
const { register, login } = require("../../controllers/authController");

// ユーザー登録エンドポイント
router.post("/register", register);

// ログインエンドポイント
router.post("/login", login);

module.exports = router;
