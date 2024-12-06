import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth"; // 登録関数をインポート

const RegisterPage = () => {
  // フォーム用のステート管理
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 登録ボタン押下時の処理
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // 過去のエラーをクリア
    setIsLoading(true);

    // パスワード一致確認
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setIsLoading(false);
      return;
    }

    try {
      const data = await register(username, password);

      // トークンをローカルストレージに保存
      localStorage.setItem("token", data.token);

      // 登録完了ページに遷移
      navigate("/complete");
    } catch (err) {
      // 登録エラー処理
      setError(err.message || "登録に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-primary">
            アカウント作成
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-brand-secondary text-brand-primary rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-brand-accent focus:z-10 sm:text-sm"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-brand-secondary text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* パスワード確認入力欄 */}
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                パスワード（確認）
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-brand-secondary text-brand-primary rounded-b-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm"
                placeholder="パスワード（確認）"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* エラー表示エリア */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* 登録ボタン */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-secondary 
            hover:bg-brand-accent 
            text-white 
            py-2 
            px-4 
            rounded"
            >
              {isLoading ? "アカウント作成中..." : "アカウント作成"}
            </button>
          </div>

          {/* ログインページへのリンク */}
          <div className="text-center">
            <a
              href="/login"
              className="font-medium text-brand-secondary hover:text-brand-accent"
            >
              既にアカウントをお持ちの方はこちら
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
