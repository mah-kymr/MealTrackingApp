// 設定関連（DB接続や環境変数）

// School・Home用
require("dotenv").config({
  path: process.env.NODE_ENV === "school" ? ".env.school" : ".env.home",
}); // dotenvで環境変数を読み込む
const { Pool } = require("pg"); // pgモジュールをインポート

// Poolインスタンスを作成
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

console.log("Database Host:", process.env.DB_HOST);

module.exports = pool; // 他のファイルで使えるようエクスポート


// Test用
// const { Pool } = require('pg');
// require('dotenv').config({
//     path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
// });

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT || 5432,
// });

// pool.connect()
//     .then(() => console.log('✅ Connected to PostgreSQL test database'))
//     .catch(err => console.error('❌ Connection error', err.stack));

// module.exports = pool;
