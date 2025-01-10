import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import validationRules from "../shared/validationRules";
import ConfirmationModal from "../components/ConfirmationModal";
import ProfileHeader from "../components/ProfileHeader";

const ProfilePage = () => {
  const [username, setUsername] = useState(""); // 現在のユーザー名
  const [userId, setUserId] = useState(""); // ユーザーID
  const [createdAt, setCreatedAt] = useState(""); // アカウント作成日
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
          setCreatedAt(data.user.created_at); // 新しいプロパティをステートに保存
          setUserId(data.user.user_id); // ユーザーIDも保存
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
      if (value.length < validationRules.username.minLength) {
        error = `ユーザー名は${validationRules.username.minLength}文字以上である必要があります`;
      } else if (value.length > validationRules.username.maxLength) {
        error = `ユーザー名は${validationRules.username.maxLength}文字以内である必要があります`;
      } else if (!validationRules.username.regex.test(value)) {
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

  return (
    <div className="min-h-screen bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* コンポーネント・ヘッダー */}
        <ProfileHeader onBack={() => navigate("/dashboard")} />

        {/* プロフィール情報 */}
        <div className="p-6 space-y-6">
          {/* カード1: ユーザー情報 */}
          <div className="bg-brand-background rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-brand-primary mb-4">
              ユーザー情報
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* ユーザー名 */}
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-gray-500 text-sm">現在のユーザー名</p>
                <p className="text-2xl font-bold text-brand-primary">
                  {username || "未設定"}
                </p>
              </div>
              {/* アカウント作成日 */}
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-gray-500 text-sm">アカウント作成日</p>
                <p className="text-2xl font-bold text-brand-primary">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : "不明"}
                </p>
              </div>
            </div>
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
              onChange={(e) => {
                setNewUsername(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  username: validateField("username", e.target.value),
                }));
              }}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="mt-2 mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">
                {errors.username}
              </p>
            )}
            {success.username && (
              <p className="mt-2 mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">
                {success.username}
              </p>
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
              <p className="mt-2 mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">
                {errors.password}
              </p>
            )}
            <input
              type="password"
              placeholder="確認用パスワード"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="mt-2 mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md ">
                {errors.confirmPassword}
              </p>
            )}
            {success.password && (
              <p className="mt-2 mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">
                {success.password}
              </p>
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
              onClick={() => setIsDeleting(true)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 mt-4"
            >
              アカウントを削除する
            </button>
          </div>

          {/* コンポーネント"アカウント削除確認モーダル" */}
          <ConfirmationModal
            isOpen={isDeleting}
            onClose={() => setIsDeleting(false)}
            onConfirm={handleDeleteAccount}
            message="本当にアカウントを削除しますか？"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
