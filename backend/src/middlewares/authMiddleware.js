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

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // トークンが提供されていない場合のエラーハンドリング
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("トークンが提供されていません。", 401);
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
    console.error("JWT verification error:", error); // エラー詳細を記録

    const message =
      error.name === "TokenExpiredError"
        ? "トークンの有効期限が切れています。"
        : "トークンが無効です。";

    throw new AuthError(message, 401);
  }
};

// エラーハンドリングミドルウェア
const errorHandler = (err, req, res, next) => {
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({
      status: "error",
      errors: [{ message: err.message }],
    });
  }
  next(err); // その他のエラーは次のエラーハンドラに渡す
};

module.exports = authMiddleware;
