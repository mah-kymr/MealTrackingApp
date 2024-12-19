import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth"; // 登録関数をインポート
import { validationRules } from "../shared/validationRules"; // 共有バリデーションルールをインポート

const RegisterPage = () => {
  const navigate = useNavigate();
  // フォーム用のステート管理
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 入力変更時のエラーチェック
  const validateField = (name, value) => {
    let error = "";

    if (name === "username") {
      if (!validationRules.username.regex.test(value)) {
        error = validationRules.username.errorMessage;
      } else if (value.length < validationRules.username.minLength) {
        error = `ユーザー名は${validationRules.username.minLength}文字以上である必要があります`;
      } else if (value.length > validationRules.username.maxLength) {
        error = `ユーザー名は${validationRules.username.maxLength}文字以内である必要があります`;
      }
    }

    if (name === "password") {
      if (!validationRules.password.regex.test(value)) {
        error = validationRules.password.errorMessage;
      }
    }

    if (name === "confirmPassword" && value !== password) {
      error = "パスワードが一致しません";
    }

    return error;
  };

  // 登録ボタン押下時の処理
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // エラーをクリア

    // 全体バリデーション
    const newErrors = {
      username: validateField("username", username),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };

    // パスワード一致確認
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
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
      setErrors({ server: err.message || "登録に失敗しました" });
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    password: validateField("password", e.target.value),
                  }));
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-brand-secondary text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm"
                placeholder="パスワード"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* パスワード確認入力欄 */}
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: validateField(
                      "confirmPassword",
                      e.target.value
                    ),
                  }));
                }}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="パスワード（確認）"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* サーバーエラーメッセージ */}
          {errors.server && (
            <p div className="text-red-500 text-sm text-center">
              {errors.server}
            </p>
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
