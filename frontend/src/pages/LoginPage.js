import React, { useState } from "react";
// ReactからuseStateフックをインポートすることで、関数コンポーネント内で状態管理を可能にする
import { login } from "../services/auth"; // login関数をインポート

const LoginPage = () => {
  // ユーザー名、パスワード、エラーメッセージ、ローディング状態を管理するためのステートを定義
  const [username, setUsername] = useState(""); // ユーザー名
  const [password, setPassword] = useState(""); // パスワード
  const [error, setError] = useState(""); // エラーメッセージ
  const [isLoading, setIsLoading] = useState(false); // ローディング状態

  // ログインボタンが押されたときの処理
  const handleLogin = async (e) => {
    e.preventDefault(); // フォームのデフォルト動作（ページリロード）を防ぐ
    setError(""); // 過去のエラーをクリア
    setIsLoading(true); // ローディング状態を開始

    try {
      const data = await login(username, password); // login関数を使用

      // ログイン成功時、トークンをローカルストレージに保存
      localStorage.setItem("token", data.token);

      // 成功時にリダイレクト
      window.location.href = "/DashboardPage";
    } catch (err) {
      // エラーが発生した場合の処理
      setError(err.message);
    } finally {
      setIsLoading(false); // ローディング状態を解除
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 中央揃えで全画面に適応したログインフォームの外枠 */}
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* ログイン画面のタイトル */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {/* onSubmitにhandleLoginを紐づけることでログインボタン押下時の処理を実行 */}
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            {/* ユーザー名入力欄 */}
            <div>
              <label htmlFor="username" className="sr-only">
                ユーザー名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="ユーザー名"
                value={username} // ステートとバインド
                onChange={(e) => setUsername(e.target.value)} // 入力値が変わったらステートを更新
              />
            </div>
            {/* パスワード入力欄 */}
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
                value={password} // ステートとバインド
                onChange={(e) => setPassword(e.target.value)} // 入力値が変わったらステートを更新
              />
            </div>
          </div>

          {/* エラー表示エリア */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* ログインボタン */}
          <div>
            <button
              type="submit"
              disabled={isLoading} // ローディング中はボタンを無効化
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "ログイン中..." : "ログイン"}
              {/* ローディング中なら「ログイン中...」、それ以外は「ログイン」と表示 */}
            </button>
          </div>

          {/* アカウント作成リンク */}
          <div className="text-center">
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              アカウントを作成
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
// LoginPageコンポーネントをエクスポート
