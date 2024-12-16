// backend/src/middlewares/authMiddleware.js
// 共通処理（認証やエラーハンドリング）

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      errors: [
        {
          message: "トークンが提供されていません。",
        },
      ],
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // デコードされたユーザー情報をリクエストに追加
    next();
  } catch (error) {
    let message;
    if (error.name === "TokenExpiredError") {
      message = "トークンの有効期限が切れています。";
    } else {
      message = "トークンが無効です。";
    }

    res.status(401).json({
      status: "error",
      errors: [
        {
          message: message,
        },
      ],
    });
  }
};

module.exports = authMiddleware;
