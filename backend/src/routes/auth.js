const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");

// ユーザー登録エンドポイント
router.post("/register", register);

module.exports = router;
