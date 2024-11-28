// 認証関連のエンドポイント

const express = require("express");
const router = express.Router();
const { register } = require("../../controllers/v1/authController");

// ユーザー登録エンドポイント
router.post("/register", register);

module.exports = router;
