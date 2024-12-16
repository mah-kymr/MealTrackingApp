import React, { useState, useEffect } from "react";
// ReactからuseStateフックをインポートすることで、関数コンポーネント内で状態管理を可能にする
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth"; // login関数をインポート

const LoginPage = () => {
  // ユーザー名、パスワード、エラーメッセージ、ローディング状態を管理するためのステートを定義
  const [username, setUsername] = useState(""); // ユーザー名
  const [password, setPassword] = useState(""); // パスワード
  const [errors, setErrors] = useState([]); // エラーメッセージ
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const navigate = useNavigate();

  // すでにログイン済みの場合はリダイレクト
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // クライアント側のバリデーション
  const validateForm = () => {
    const newErrors = [];

    if (!username) {
      newErrors.push({
        field: "username",
        message: "ユーザー名を入力してください",
      });
    }

    if (!password) {
      newErrors.push({
        field: "password",
        message: "パスワードを入力してください",
      });
    }

    return newErrors;
  };

  // ログインボタンが押されたときの処理
  const handleLogin = async (e) => {
    e.preventDefault(); // フォームのデフォルト動作（ページリロード）を防ぐ

    // クライアント側バリデーション
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]); // 過去のエラーをクリア
    setIsLoading(true); // ローディング状態を開始

    try {
      const data = await login(username, password); // login関数を使用

      // ログイン成功時、トークンをローカルストレージに保存
      localStorage.setItem("token", data.token);

      // ダッシュボードにリダイレクト
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      const serverErrors = err.response?.data?.errors || [
        { message: "ログインに失敗しました。再度お試しください。" },
      ];
      setErrors(serverErrors);
    } finally {
      setIsLoading(false); // ローディング状態を解除
    }
  };

  const getFieldError = (fieldName) => {
    const fieldError = errors.find((err) => err.field === fieldName);
    return fieldError ? fieldError.message : null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      {/* 中央揃えで全画面に適応したログインフォームの外枠 */}
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
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  getFieldError("username")
                    ? "border-red-500"
                    : "border-gray-300"
                } placeholder-brand-secondary text-brand-primary rounded-t-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm`}
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-describedby="username-error"
              />
              {getFieldError("username") && (
                <p id="username-error" className="text-red-500 text-sm">
                  {getFieldError("username")}
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
                  getFieldError("password")
                    ? "border-red-500"
                    : "border-gray-300"
                } placeholder-brand-secondary text-brand-primary rounded-b-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm`}
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="password-error"
              />
              {getFieldError("password") && (
                <p id="password-error" className="text-red-500 text-sm">
                  {getFieldError("password")}
                </p>
              )}
            </div>
          </div>

          {/* フィールド外のエラーメッセージ */}
          {errors
            .filter((err) => !err.field)
            .map((err, index) => (
              <div key={index} className="text-red-500 text-sm text-center">
                {err.message}
              </div>
            ))}

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
