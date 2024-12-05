// backend/src/middlewares/authMiddleware.js
// 共通処理（認証やエラーハンドリング）

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "トークンが提供されていません。" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // デコードされたユーザー情報をリクエストに追加
    next();
  } catch (error) {
    error.name === "TokenExpiredError"
      ? "トークンの有効期限が切れています。"
      : "トークンが無効です。";
    res.status(401).json({ error: message });
  }
};

module.exports = authMiddleware;
