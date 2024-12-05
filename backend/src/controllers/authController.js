// backend/src/controllers/authController.js
// 認証関連のロジック
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // JWTを使用するためにインポート
const pool = require("../config/db"); // DB接続設定をインポート

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

// ログイン関数
const login = async (req, res) => {
  console.log("Login request body:", req.body); // デバッグ用ログ

  const { username, password } = req.body;

  // 必須フィールドのチェック
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // データベースからユーザーを取得
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // JWTの生成
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET, // JWTのシークレットキー（.envで設定）
      { expiresIn: "1h" } // トークンの有効期限
    );

    // 成功レスポンス
    res.json({
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token"); // Cookieに保存していたトークンを削除
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };
