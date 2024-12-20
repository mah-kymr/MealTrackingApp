import React, { useState } from "react";

const ProfilePage = () => {
  const [username, setUsername] = useState(""); // 新しいユーザー名を保存
  const [password, setPassword] = useState(""); // 新しいパスワードを保存
  const [message, setMessage] = useState(""); // 結果メッセージを表示

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // 保存されているトークンを取得
      const response = await fetch("/api/v1/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
        },
        body: JSON.stringify({ username, password }), // 入力データを送信
      });

      if (response.ok) {
        setMessage("プロフィールが更新されました！");
      } else {
        setMessage("プロフィールの更新に失敗しました。");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("エラーが発生しました。もう一度お試しください。");
    }
  };

  return (
    <div className="min-h-screen bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-brand-secondary text-white px-6 py-4">
          <h1 className="text-2xl font-bold">プロフィール編集</h1>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="新しいユーザー名"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // ユーザー名入力を管理
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            />
            <input
              type="password"
              placeholder="新しいパスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // パスワード入力を管理
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            />
            <button
              onClick={handleUpdateProfile}
              className="w-full bg-brand-primary text-white py-2 px-4 rounded hover:bg-brand-secondary focus:outline-none"
            >
              更新
            </button>
            {message && (
              <p className="text-center text-brand-primary mt-4">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
