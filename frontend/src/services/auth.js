// services/auth.js

// APIのベースURLを定義（※未使用、拡張時のために用意）
const API_BASE_URL = "http://localhost:3000/api";

/**
 * ユーザーログイン関数
 * @param {string} username - ログインユーザー名
 * @param {string} password - ログインパスワード
 * @returns {Promise<Object>} ログイン成功時のレスポンスデータ
 * @throws {Error} ログイン失敗時のエラー
 */

export const login = async (username, password) => {
  try {
    // fetch APIを使用してログインエンドポイントにリクエストを送信
    // 相対URLで指定（プロキシ設定無効化を防ぐため：プロキシはfrontendのpackage.jsonにて設定）
    const response = await fetch(`/api/v1/auth/login`, {
      // POSTメソッドを使用してログイン情報を送信
      method: "POST",
      // JSONデータを送信するためのヘッダーを設定
      headers: {
        "Content-Type": "application/json",
      },
      // ユーザー名とパスワードをJSONに変換して送信
      body: JSON.stringify({ username, password }),
    });

    // レスポンスのステータスが成功（200-299）でない場合、エラーを投げる
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // レスポンスをJSONとしてパース
    // 通常、この段階でトークンや認証情報が返される
    const data = await response.json();

    // パースされたデータを返す（通常はトークンや認証情報）
    return data; // data.tokenなどを返す
  } catch (error) {
    // エラーをコンソールに出力
    console.error("Error during login:", error);

    // エラーを呼び出し元に再スロー
    // これにより、呼び出し元で適切なエラーハンドリングが可能になる
    throw error;
  }
};
