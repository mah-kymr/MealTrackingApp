// 必要なライブラリのインポート
const bcrypt = require("bcryptjs"); // パスワードハッシュ化のためのライブラリ
const jwt = require("jsonwebtoken"); // JSON Web Tokenの生成と検証のためのライブラリ
const { validationResult } = require("express-validator"); // 入力バリデーション用（現在は未使用）
const pool = require("../config/db"); // データベース接続プール

// ユーザー登録処理
const registerUser = async (req, res) => {
  // リクエストボディからusernameとpasswordを抽出
  const { username, password } = req.body;

  try {
    // 事前にユーザー名の重複をチェック
    const existingUser = await pool.query(
      "SELECT * FROM Users WHERE username = $1",
      [username]
    );

    // ユーザー名が既に存在する場合
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "このユーザー名は既に使用されています。",
      });
    }

    // ソルト生成（パスワードハッシュ化のための追加文字列）
    const salt = await bcrypt.genSalt(10); // ソルトの複雑さを10に設定

    // パスワードをソルトを使用してハッシュ化
    // これにより、生のパスワードが保存されず、セキュリティが向上
    const hashedPassword = await bcrypt.hash(password, salt);

    // データベースに新規ユーザーを挿入
    // $1, $2はプレースホルダーで、SQLインジェクション対策
    const result = await pool.query(
      "INSERT INTO Users (username, password_hash) VALUES ($1, $2) RETURNING user_id",
      [username, hashedPassword]
    );

    // 201 Created ステータスで、作成されたユーザーのIDを返す
    res.status(201).json({ user_id: result.rows[0].user_id });
  } catch (error) {
    // データベースエラー（一意性制約違反など）をキャッチ
    if (error.code === "23505") {
      // PostgreSQLの一意性制約エラーコード
      return res.status(400).json({
        error: "ユーザー登録に失敗しました。再度お試しください。",
      });
    }

    // その他の一般的なエラー
    res.status(500).json({ error: "ユーザー登録に失敗しました。" });
  }
};

// // ユーザーログイン処理
// const loginUser = async (req, res) => {
//   // リクエストボディからusernameとpasswordを抽出
//   const { username, password } = req.body;

//   try {
//     // データベースからユーザー名で検索
//     const user = await pool.query("SELECT * FROM Users WHERE username = $1", [
//       username,
//     ]);

//     // ユーザーが存在しない場合
//     if (user.rows.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "ユーザー名またはパスワードが間違っています。" });
//     }

//     // 入力されたパスワードとデータベース保存のハッシュ化されたパスワードを比較
//     const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);

//     // パスワードが一致しない場合
//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ error: "ユーザー名またはパスワードが間違っています。" });
//     }

//     // JWTトークンを生成
//     // ペイロードにuser_idを含め、秘密鍵で署名
//     // 有効期限を1時間に設定
//     const token = jwt.sign(
//       { user_id: user.rows[0].user_id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     // トークンをクライアントに返す
//     res.json({ token });
//   } catch (error) {
//     // サーバーエラー時は500エラーを返す
//     res.status(500).json({ error: "ログインに失敗しました。" });
//   }
// };

// // ユーザープロファイル取得処理
// const getUserProfile = async (req, res) => {
//   try {
//     // JWTミドルウェアで既に認証済みのuser_idを使用してユーザー情報を取得
//     // センシティブな情報（パスワードハッシュなど）は除外
//     const user = await pool.query(
//       "SELECT user_id, username FROM Users WHERE user_id = $1",
//       [
//         req.user.user_id, // 認証ミドルウェアでセットされたuser_id
//       ]
//     );

//     // ユーザー情報を返す
//     res.json(user.rows[0]);
//   } catch (error) {
//     // サーバーエラー時は500エラーを返す
//     res.status(500).json({ error: "ユーザー情報の取得に失敗しました。" });
//   }
// };

// モジュールをエクスポート（ルーターで使用）
module.exports = { registerUser /*, loginUser, getUserProfile */ };
