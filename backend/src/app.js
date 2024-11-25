require("dotenv").config();
const express = require("express");
const { Pool } = require("pg"); // PostgreSQLの接続用ライブラリ

// 環境変数を使ってデータベース接続を設定
const pool = new Pool({
  host: process.env.DB_HOST, // .envファイルのDB_HOSTを使用
  user: process.env.DB_USER, // .envファイルのDB_USERを使用
  password: process.env.DB_PASSWORD, // .envファイルのDB_PASSWORDを使用
  database: process.env.DB_NAME, // .envファイルのDB_NAMEを使用
  port: process.env.DB_PORT, // .envファイルのDB_PORTを使用
});

const app = express();
const PORT = 3000;

// テスト用のAPIエンドポイント
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // DBに接続して現在時刻を取得
    res.json(result.rows); // 結果を返却
  } catch (err) {
    res.status(500).send(err.message); // エラーがあれば500を返却
  }
});

// ルートエンドポイント
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Meal Tracking App API! Use /db-test to check the database connection."
  );
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("Database host is:", process.env.DB_HOST);
