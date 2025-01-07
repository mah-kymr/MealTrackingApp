import React, { useState, useEffect } from "react";
// ReactからuseStateフックをインポートする → 関数コンポーネント内で状態管理を可能にする
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth"; // login関数をインポート
import validationRules from "../shared/validationRules"; // 共有バリデーションルール

const LoginPage = () => {
  // ユーザー名、パスワード、エラーメッセージ、ローディング状態を管理するためのステートを定義
  const [username, setUsername] = useState(""); // ユーザー名
  const [password, setPassword] = useState(""); // パスワード
  const [errors, setErrors] = useState({}); // エラーメッセージ
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const navigate = useNavigate();

  // すでにログイン済みの場合はリダイレクト
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // 入力バリデーション
  const validateInput = () => {
    const validationErrors = {};

    // ユーザー名のバリデーション
    if (!validationRules.username.regex.test(username)) {
      validationErrors.username = validationRules.username.errorMessage;
    } else if (username.length < validationRules.username.minLength) {
      validationErrors.username = `ユーザー名は${validationRules.username.minLength}文字以上である必要があります`;
    } else if (username.length > validationRules.username.maxLength) {
      validationErrors.username = `ユーザー名は${validationRules.username.maxLength}文字以内である必要があります`;
    }

    // パスワードのバリデーション
    if (!validationRules.password.regex.test(password)) {
      validationErrors.password = validationRules.password.errorMessage;
    }

    return validationErrors;
  };

  // フォームの送信処理
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({}); // 過去のエラーをクリア

    const validationErrors = validateInput();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true); // ローディング開始
      const data = await login(username, password); // サーバーにログインリクエスト
      localStorage.setItem("token", data.token);
      navigate("/dashboard"); // ダッシュボードにリダイレクト
    } catch (err) {
      console.error("Error during login:", err);

      // サーバーエラー処理
      if (err.message.includes("500")) {
        setErrors({
          server:
            "サーバーエラーが発生しました。管理者にお問い合わせください。",
        });
      } else {
        setErrors({
          server: err.message,
        });
      }
    } finally {
      setIsLoading(false); // ローディング終了
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* ログイン画面のタイトル */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-primary">
          ログイン
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {/* onSubmitにhandleLoginを紐づけることでログインボタン押下時の処理を実行 */}
          <div className="rounded-md shadow-sm -space-y-px">
            {/* ユーザー名入力欄 */}
            <div>
              <input
                id="username"
                name="username"
                type="text"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } placeholder-brand-secondary text-brand-primary rounded-t-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm`}
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-describedby="username-error"
              />
              {errors.username && (
                <p
                  id="username-error"
                  className="bg-red-100 text-red-600 text-sm rounded-md p-2 mt-1"
                >
                  {errors.username}
                </p>
              )}
            </div>
            {/* パスワード入力欄 */}
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-brand-secondary text-brand-primary rounded-b-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm`}
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="password-error"
              />
              {errors.password && (
                <p
                  id="password-error"
                  className="bg-red-100 text-red-600 text-sm rounded-md p-2 mt-1"
                >
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* サーバーエラーメッセージ */}
          {errors.server && (
            <div className="text-red-500 text-sm text-center">
              {errors.server}
            </div>
          )}

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-secondary hover:bg-brand-accent text-white py-2 px-4 rounded"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
          <div className="text-center">
            <a
              href="/register"
              className="text-brand-secondary hover:text-brand-accent"
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
