const pool = require("./config/db"); // 正しいパスでdb.jsを読み込む

// PostgreSQLに接続して現在時刻を取得するテスト
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err); // エラー発生時
  } else {
    console.log("Database connected at:", res.rows[0].now); // 接続成功時に現在時刻を表示
  }
  pool.end(); // 接続を終了
});
