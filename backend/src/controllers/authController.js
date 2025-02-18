// backend/src/controllers/authController.js
// 認証関連のロジック
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // JWTを使用するためにインポート
const pool = require("../config/db"); // DB接続設定をインポート
const schemas = require("../validation/schemas"); // Joiスキーマをインポート

// 共通エラーハンドリング関数
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "error",
    errors: [{ message }],
  });
};

// ユーザー登録関数
const register = async (req, res) => {
  try {
    console.log("Register request received:", req.body); // 📌 受け取ったリクエストボディをログ

    // リクエストボディから必要なプロパティを取得し、confirmPasswordを無視
    const { username, password, confirmPassword } = req.body;

    // パスワードと確認用パスワードが一致するか確認
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        errors: [
          { field: "confirmPassword", message: "Passwords do not match" },
        ],
      });
    }

    // ユーザー名の重複チェック
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (existingUser.rows.length > 0) {
      console.error("User already exists:", username);
      return res.status(409).json({ message: "Username already exists" });
    }

    // joiバリデーション
    const { error } = schemas.register.validate(req.body);
    if (error) {
      console.error("Validation error:", error.details);
      return res.status(400).json({
        status: "error",
        errors: error.details.map((detail) => ({
          field: detail.path[0],
          message: detail.message,
        })),
      });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // データベースにユーザーを保存
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    const newUser = result.rows[0]; // 📌 修正：newUser を定義

    console.log("User registered successfully:", result.rows[0]); // 📌 登録されたユーザー情報をログ

    // JWT トークンの生成
    const token = jwt.sign(
      { user_id: newUser.user_id, username: newUser.username },
      process.env.JWT_SECRET, // JWTのシークレットキー（.envで設定）
      { expiresIn: process.env.JWT_EXPIRATION || "1h" } // トークンの有効期限を環境変数から取得（未定義ならデフォルト1時間）
    );

    // 成功レスポンス
    res.status(201).json({
      message: "User registered successfully",
      token, // トークンをレスポンスとして返す
    });
  } catch (err) {
    console.error("❌ Error in register function:", err); // 📌 エラー詳細をログ
    // エラーハンドリング
    if (err.code === "23505") {
      // PostgreSQLエラーコード 23505: 一意制約違反
      return res
        .status(409)
        .json({ status: "error", message: "Username already exists" });
    }
    res.status(500).json({
      status: "error",
      errors: [{ message: "Internal server error", details: err.message }],
    });
  }
};

// ログイン関数
const login = async (req, res) => {
  const { error } = schemas.login.validate(req.body);
  if (error) {
    console.error("Validation error:", error.details);
    return res.status(400).json({
      status: "error",
      errors: error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      })),
    });
  }

  const { username, password } = req.body;

  try {
    console.log("Login attempt:", { username }); // ログイン試行の記録

    // データベースからユーザーを取得
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    console.log("Database query result:", result.rows);

    if (result.rows.length === 0) {
      console.log("Invalid username");
      return handleError(res, 401, "Invalid username or password");
    }

    const user = result.rows[0];

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log("Password validation:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // JWTの生成
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET, // JWTのシークレットキー（.envで設定）
      { expiresIn: process.env.JWT_EXPIRATION } // トークンの有効期限を環境変数から取得
    );
    console.log("Generated token:", token);

    // 成功レスポンス
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ログアウト関数
const logout = (req, res) => {
  res.clearCookie("token"); // Cookieに保存していたトークンを削除
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// プロフィール取得関数
const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // トークンから取得したユーザーID

    const result = await pool.query(
      "SELECT user_id, username, created_at FROM users WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return handleError(res, 404, "User not found");
    }

    res.status(200).json({
      status: "success",
      user: result.rows[0],
    });
  } catch (err) {
    return handleError(res, 500, "Internal server error");
  }
};

// ユーザー名を更新する
const updateProfile = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      status: "error",
      message: "ユーザー名は必須です。",
    });
  }

  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      "UPDATE users SET username = $1 WHERE user_id = $2 RETURNING user_id, username",
      [username, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "ユーザーが見つかりません。",
      });
    }

    res.status(200).json({
      status: "success",
      message: "ユーザー名が正常に更新されました。",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({
      status: "error",
      message: "サーバーエラーが発生しました。",
    });
  }
};

// パスワードを更新する
const updatePassword = async (req, res) => {
  const { currentPassword, password } = req.body;
  const userId = req.user.user_id;

  try {
    const user = await pool.query(
      "SELECT password_hash FROM users WHERE user_id = $1",
      [userId]
    );

    if (!user.rows.length) {
      return res.status(404).json({
        status: "error",
        message: "ユーザーが見つかりません。",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.rows[0].password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "現在のパスワードが正しくありません。",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE user_id = $2", [
      hashedPassword,
      userId,
    ]);

    res.status(200).json({
      status: "success",
      message: "パスワードが正常に更新されました。",
    });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({
      status: "error",
      message: "サーバーエラーが発生しました。",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.user_id; // トークンからユーザーIDを取得
    const result = await pool.query("DELETE FROM users WHERE user_id = $1", [
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "ユーザーが見つかりません。" });
    }

    res.status(200).json({ message: "アカウントが削除されました。" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
};
