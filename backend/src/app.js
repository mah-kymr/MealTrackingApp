// backend/src/app.js
// Expressを使用したAPIアプリケーションのエントリーポイント

// 必要な外部モジュールとルートをインポート
const express = require("express");
const authRoutes = require("./routes/v1/auth"); // 認証関連のルートをインポート
const cors = require("cors");
require("dotenv").config(); // 環境変数を読み込む

// Expressアプリケーションのインスタンスを作成
const app = express();

// CORSの設定: クロスオリジンリソース共有の設定
// フロントエンドからのリクエストを許可するための設定
const corsOptions = {
  origin: "http://localhost:3001", // フロントエンドのURL
  methods: "GET,POST", // 許可するHTTPメソッド
  allowedHeaders: "Content-Type,Authorization", // 許可するヘッダー
};
app.use(cors(corsOptions));

// JSONリクエストを解析するミドルウェア
// クライアントからのJSONデータを自動的にパースする
app.use(express.json());

// 詳細なリクエストログのミドルウェア: リクエストの詳細な情報をログ出力
app.use((req, res, next) => {
  const sanitizedHeaders = { ...req.headers };
  delete sanitizedHeaders.authorization; // 機密情報を削除
  console.log("Request received:", {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: sanitizedHeaders,
  });
  next();
});

// ルートパス（/）へのGETリクエストに対するハンドラー
// APIの基本情報とステータスを返す
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Meal Tracking App API",
    status: "running",
  });
});

// 認証関連のルートを'/api/v1/auth'パスに登録
app.use("/api/v1/auth", authRoutes);

// グローバルエラーハンドリングミドルウェア
// キャッチされなかったエラーを処理し、適切なエラーレスポンスを返す
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message,
  });
});

// サーバーの起動設定
// 環境変数からポート番号を取得、デフォルトは3000
const PORT = process.env.PORT || 3000;

// サーバーを指定のポートとIPアドレスで起動
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Server is also accessible on all network interfaces");
});
