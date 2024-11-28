const bcrypt = require("bcrypt");
const pool = require("../../config/db"); // DB接続設定をインポート

// ユーザー登録関数
const register = async (req, res) => {
  const { username, password } = req.body;

  // 必須フィールドのチェック
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // データベースにユーザーを保存
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    // 成功レスポンス
    res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: result.rows[0].user_id,
        username: result.rows[0].username,
      },
    });
  } catch (err) {
    // エラーハンドリング
    if (err.code === "23505") {
      // PostgreSQLエラーコード 23505: 一意制約違反
      res.status(409).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = { register };
