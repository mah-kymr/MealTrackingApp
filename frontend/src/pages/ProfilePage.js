import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validationRules } from "../shared/validationRules";

const ProfilePage = () => {
  const [username, setUsername] = useState(""); // 現在のユーザー名を管理
  const [newUsername, setNewUsername] = useState(""); // 新しいユーザー名
  const [currentPassword, setCurrentPassword] = useState(""); // 現在のパスワード
  const [newPassword, setNewPassword] = useState(""); // 新しいパスワード
  const [confirmPassword, setConfirmPassword] = useState(""); // 確認用パスワード
  const [errors, setErrors] = useState({}); // エラーメッセージを個別に管理
  const [success, setSuccess] = useState({}); // 成功メッセージを個別に管理
  const [isDeleting, setIsDeleting] = useState(false); // 削除確認モーダル表示状態
  const navigate = useNavigate();

  useEffect(() => {
    // 現在のユーザー名を取得
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/v1/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.user.username);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const validateField = (name, value) => {
    let error = "";

    if (name === "username") {
      if (!validationRules.username.regex.test(value)) {
        error = validationRules.username.errorMessage;
      }
    }

    if (name === "password") {
      if (!validationRules.password.regex.test(value)) {
        error = validationRules.password.errorMessage;
      }
    }

    if (name === "confirmPassword" && value !== newPassword) {
      error = "パスワードが一致しません";
    }

    return error;
  };

  // ユーザー名更新
  const handleUpdateUsername = async () => {
    const usernameError = validateField("username", newUsername);
    setErrors((prev) => ({ ...prev, username: usernameError }));
    if (usernameError) return;

    try {
      const token = localStorage.getItem("token"); // 保存されているトークンを取得
      const response = await fetch("/api/v1/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
        },
        body: JSON.stringify({ username: newUsername }), // 入力データを送信
      });

      if (response.ok) {
        setUsername(newUsername);
        setNewUsername("");
        setErrors((prev) => ({ ...prev, username: "" }));
        setSuccess((prev) => ({
          ...prev,
          username: "ユーザー名が正常に更新されました！",
        }));
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  // パスワード更新
  const handleUpdatePassword = async () => {
    const passwordError = validateField("password", newPassword);
    const confirmPasswordError = validateField(
      "confirmPassword",
      confirmPassword
    );
    setErrors((prev) => ({
      ...prev,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    }));
    if (passwordError || confirmPasswordError) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        setSuccess((prev) => ({
          ...prev,
          password: "パスワードが正常に更新されました！",
        }));
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };
  // アカウント削除確認モーダルを開く
  const handleDeleteAccountClick = () => {
    setIsDeleting(true);
  };

  // アカウントを削除
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ダッシュボードに戻る
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-brand-secondary text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">プロフィール管理</h1>
          <button
            onClick={handleBackToDashboard}
            className="bg-white text-brand-primary hover:bg-brand-background font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            ダッシュボードに戻る
          </button>
        </div>

        {/* プロフィール情報 */}
        <div className="p-6 space-y-6">
          {/* カード1: ユーザー情報 */}
          <div className="bg-brand-background rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-brand-primary mb-4">
              ユーザー情報
            </h2>
            <p>
              <strong>現在のユーザー名:</strong> {username}
            </p>
          </div>

          {/* カード2: ユーザー名変更 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-brand-primary mb-4">
              ユーザー名の変更
            </h2>
            <input
              type="text"
              placeholder="新しいユーザー名"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
            {errors.username && (
              <p className="mt-2 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">{errors.username}</p>
            )}
            {success.username && (
              <p className="mt-2 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">{success.username}</p>
            )}
            <button
              onClick={handleUpdateUsername}
              className="w-full bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary mt-4"
            >
              更新
            </button>
          </div>
          {/* カード3: パスワード変更 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-brand-primary mb-4">
              パスワードの変更
            </h2>
            <input
              type="password"
              placeholder="現在のパスワード"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="password"
              placeholder="新しいパスワード"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none mb-2"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">{errors.password}</p>
            )}
            <input
              type="password"
              placeholder="確認用パスワード"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">{errors.confirmPassword}</p>
            )}
            {success.password && (
              <p className="mt-2 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">{success.password}</p>
            )}
            <button
              onClick={handleUpdatePassword}
              className="w-full bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary mt-4"
            >
              更新
            </button>
          </div>
          {/* アカウント削除 */}
          <div className="bg-red-50 rounded-lg p-6 shadow-md border border-red-200">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              アカウントの削除
            </h2>
            <p className="text-red-600 mb-4">
              アカウントを削除すると、すべてのデータが失われます。この操作は元に戻せません。
            </p>
            <button
              onClick={handleDeleteAccountClick}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 mt-4"
            >
              アカウントを削除する
            </button>
          </div>

          {/* 確認モーダル */}
          {isDeleting && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-md shadow-md">
                <p className="mb-4">本当にアカウントを削除しますか？</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsDeleting(false)}
                    className="bg-gray-400 text-white py-2 px-4 rounded"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white py-2 px-4 rounded"
                  >
                    削除する
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
