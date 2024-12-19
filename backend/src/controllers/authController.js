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
  const { error } = schemas.register.validate(req.body);
  if (error) {
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
    // データベースからユーザーを取得
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return handleError(res, 401, "Invalid username or password");
    }

    const user = result.rows[0];

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return handleError(res, 401, "Invalid username or password");
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
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    return handleError(res, 500, "Internal server error");
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
    let query = "UPDATE users SET ";
    const params = [];

    if (username) {
      params.push(username);
      query += `username = $${params.length}`;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (params.length > 0) query += ", ";
      params.push(hashedPassword);
      query += `password_hash = $${params.length}`;
    }

    params.push(userId);
    query += ` WHERE user_id = $${params.length} RETURNING user_id, username, created_at`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return handleError(res, 404, "User not found");
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    return handleError(res, 500, "Internal server error");
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};
