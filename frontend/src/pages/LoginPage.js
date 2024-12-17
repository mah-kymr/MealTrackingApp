import React, { useState, useEffect } from "react";
// ReactからuseStateフックをインポートする → 関数コンポーネント内で状態管理を可能にする
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth"; // login関数をインポート
import * as Yup from "yup";

// Yupバリデーションスキーマを定義
const validationSchema = Yup.object({
  username: Yup.string()
    .required("ユーザー名を入力してください")
    .test(
      "alphanumWithSymbols",
      "ユーザー名は英数字と一部の特殊文字 (@$!%*#?&) のみ使用できます",
      (value) => /^[A-Za-z0-9@$!%*#?&]+$/.test(value)
    ),
  password: Yup.string()
    .required("パスワードを入力してください")
    .min(8, "パスワードは8文字以上で入力してください"),
});

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
  // フォームのバリデーションと送信処理
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({}); // エラー状態をクリア

    try {
      // Yupでバリデーション実行
      await validationSchema.validate(
        { username, password },
        { abortEarly: false }
      );

      setIsLoading(true); // ローディングを開始

      // サーバーにログインリクエストを送信
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      navigate("/dashboard"); // ダッシュボードにリダイレクト
    } catch (err) {
      // Yupのバリデーションエラーを処理
      if (err.name == "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        // サーバーエラーを処理
        const serverErrors = err.response?.data?.errors || [
          { message: "ログインに失敗しました。再度お試しください。" },
        ];
        setErrors({ server: serverErrors.map((e) => e.message).join(",") });
      }
    } finally {
      setIsLoading(false); // ローディング状態を解除
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
