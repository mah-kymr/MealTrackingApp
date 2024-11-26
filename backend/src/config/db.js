require("dotenv").config(); // dotenvで環境変数を読み込む
const { Pool } = require("pg"); // pgモジュールをインポート

// Poolインスタンスを作成
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

module.exports = pool; // 他のファイルで使えるようエクスポート
