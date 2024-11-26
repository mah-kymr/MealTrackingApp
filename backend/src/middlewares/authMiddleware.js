// JSON Web Token (JWT) を検証・デコードするためのライブラリをインポート
const jwt = require("jsonwebtoken");

// 認証ミドルウェア関数
const authMiddleware = (req, res, next) => {
  // リクエストヘッダーからAuthorizationトークンを抽出
  // 形式: "Bearer <token>"
  // Optional Chaining (?.) を使用して、ヘッダーが存在しない場合のエラーを防ぐ
  // split(' ')[1]で、"Bearer "の後のトークン部分のみを取得
  const token = req.header("Authorization")?.split(" ")[1];

  // トークンが存在しない場合
  if (!token) {
    // 401 Unauthorized: 認証が必要であることを示す
    // クライアントにトークンの不足を通知
    return res.status(401).json({ error: "トークンが提供されていません。" });
  }

  try {
    // JWTを検証
    // process.env.JWT_SECRETは環境変数に保存された秘密鍵
    // デコードされたペイロードには、トークン生成時に含めた情報（user_idなど）が含まれる
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // デコードされた情報をリクエストオブジェクトに追加
    // 後続のルートハンドラで req.user として利用可能
    req.user = decoded;

    // 次のミドルウェアまたはルートハンドラに処理を渡す
    next();
  } catch (error) {
    // トークンの検証に失敗した場合（改ざん、期限切れなど）
    // 401 Unauthorized: 提供されたトークンが無効であることを通知
    res.status(401).json({ error: "トークンが無効です。" });
  }
};

// このミドルウェアを他のモジュールで使用できるようにエクスポート
module.exports = authMiddleware;
