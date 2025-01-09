// backend/src/middlewares/authMiddleware.js
// リクエストヘッダーからトークンを取り出して検証 → ユーザー情報をreq.userに追加

const jwt = require("jsonwebtoken");

// カスタムエラークラス
class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 認証ミドルウェア
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // トークンが提供されていない場合のエラーハンドリング
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Auth Error: トークンが提供されていません。");
    return res.status(401).json({
      status: "error",
      errors: [{ message: "トークンが提供されていません。" }],
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("Token received for validation:", token.slice(0, 10) + "..."); // トークンの一部を記録

    // トークン検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // デコード結果を記録

    req.user = decoded; // デコードされたユーザー情報をリクエストに追加
    next(); // 次のミドルウェアまたはルートハンドラに進む
  } catch (error) {
    console.error("JWT verification error:", error.message); // エラー詳細を記録

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        errors: [{ message: "トークンの有効期限が切れています。" }],
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        errors: [{ message: "トークンが無効です。" }],
      });
    }

    // 予期しないエラー
    return res.status(500).json({
      status: "error",
      errors: [{ message: "認証処理中にエラーが発生しました。" }],
    });
  }
};

// エラーハンドリングミドルウェア
const errorHandler = (err, req, res, next) => {
  if (err instanceof AuthError) {
    console.error("Handled AuthError:", err.message);
    return res.status(err.statusCode).json({
      status: "error",
      errors: [{ message: err.message }],
    });
  }

  // その他のエラーは次のエラーハンドラに渡す
  console.error("Unhandled Error:", err.message);
  next(err);
};

module.exports = authMiddleware;
