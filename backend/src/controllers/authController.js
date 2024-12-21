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
  // リクエストボディから必要なプロパティを取得し、confirmPasswordを無視
  const { username, password, confirmPassword } = req.body;
  console.log("Request body:", req.body);

  // パスワードと確認用パスワードが一致するか確認
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "error",
      errors: [{ field: "confirmPassword", message: "Passwords do not match" }],
    });
  }

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

  try {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // データベースにユーザーを保存
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    // 登録されたユーザー情報を取得
    const newUser = result.rows[0];

    // JWTの生成
    const token = jwt.sign(
      { user_id: newUser.user_id, username: newUser.username },
      process.env.JWT_SECRET, // JWTのシークレットキー（.envで設定）
      { expiresIn: "1h" } // トークンの有効期限
    );

    // 成功レスポンス
    res.status(201).json({
      message: "User registered successfully",
      token, // トークンをレスポンスとして返す
    });
  } catch (err) {
    // エラーハンドリング
    if (err.code === "23505") {
      // PostgreSQLエラーコード 23505: 一意制約違反
      return handleError(res, 409, "Username already exists");
    }
    return handleError(res, 500, "Internal server error");
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
      { expiresIn: "1h" } // トークンの有効期限
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

// プロフィール更新関数
const updateProfile = async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    return handleError(
      res,
      400,
      "At least one field (username or password) is required"
    );
  }

  try {
    const userId = req.user.user_id;
    let updateQuery = "UPDATE users SET ";
    const values = [];
    if (username) {
      values.push(username);
      updateQuery += `username = $${values.length}`;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (values.length > 0) updateQuery += ", ";
      values.push(hashedPassword);
      updateQuery += `password_hash = $${values.length}`;
    }
    values.push(userId);
    updateQuery += ` WHERE user_id = $${values.length} RETURNING user_id, username`;

    const result = await pool.query(updateQuery, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
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
  deleteAccount,
};
