// エントリーポイント

const express = require("express");
const authRoutes = require("./routes/auth");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors()); // インストールが必要: npm install cors

// リクエストログのミドルウェア
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  next();
});

app.use((req, res, next) => {
  console.log("Request received:", {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers,
  });
  next();
});

// JSONリクエストを解析するミドルウェア
app.use(express.json());

// テスト用のシンプルなGETエンドポイント
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// 認証関連のルートを登録
app.use("/api/auth", authRoutes);

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Server is also accessible on all network interfaces");
});
