// backend/src/middlewares/authMiddleware.js
// リクエストヘッダーからトークンを取り出して検証 → ユーザー情報をreq.userに追加

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // トークンが提供されていない場合のエラーハンドリング
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
    // トークン検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // デコードされたユーザー情報をリクエストに追加
    next(); // 次のミドルウェアまたはルートハンドラに進む
  } catch (error) {
    let message;
    if (error.name === "TokenExpiredError") {
      message = "トークンの有効期限が切れています。";
    } else {
      message = "トークンが無効です。";
    }

    // トークン検証がエラーの場合
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
