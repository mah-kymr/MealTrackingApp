const express = require("express");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();

// JSONリクエストを解析するミドルウェア
app.use(express.json());

// 認証関連のルートを登録
app.use("/api/auth", authRoutes);

// サーバーを起動
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
