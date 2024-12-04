// DashboardPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  // ステート管理
  // ユーザーデータ、ローディング状態、エラー状態を管理
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ページ遷移のためのナビゲーションフック
  const navigate = useNavigate();

  useEffect(() => {
    // コンポーネントマウント時に実行される副作用関数
    // 認証トークンの確認と、ユーザープロファイル取得を行う

    // ローカルストレージからトークンを取得
    const token = localStorage.getItem("token");

    // トークンが存在しない場合はログインページにリダイレクト
    if (!token) {
      navigate("/");
      return;
    }

    // ユーザープロファイル取得の非同期関数
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // バックエンドのプロファイルエンドポイントにリクエスト
        const response = await fetch("/api/v1/auth/profile", {
          method: "GET",
          headers: {
            // 認証トークンをヘッダーに設定
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // レスポンスステータスをチェック
        console.log("Response Status:", response.status);

        // レスポンスが正常でない場合はエラーをスロー
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error Response:", errorText);
          throw new Error(errorText || "プロファイル取得に失敗しました");
        }

        // JSONとしてパース
        const data = await response.json();

        // ユーザーデータをステートに設定
        setUserData({
          userId: data.user_id,
          username: data.username,
        });

        // ローディング状態を解除
        setIsLoading(false);
      } catch (err) {
        // エラーの詳細をログ出力
        console.error("Fetch Error Details:", err);
        setError(err.message);
        setIsLoading(false);
        localStorage.removeItem("token");
        navigate("/"); // エラー時にログインページにリダイレクト
      }
    };

    // ユーザープロファイル取得関数の実行
    fetchUserProfile();
  }, [navigate]); // navigateが変更された際に再実行

  // ログアウトハンドラ
  const handleLogout = () => {
    // トークンをローカルストレージから削除
    localStorage.removeItem("token");
    // ログインページにリダイレクト
    navigate("/");
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー発生時の表示
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-center text-2xl font-bold text-red-600 mb-4">
              エラーが発生しました
            </h2>
            <p className="text-center text-gray-700">{error}</p>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // メインのダッシュボード画面
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* ダッシュボードヘッダー */}
          <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              ログアウト
            </button>
          </div>

          {/* ユーザー情報セクション */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 個人情報 */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  ユーザー情報
                </h2>
                <div className="space-y-2">
                  <p>
                    <strong>ユーザーID:</strong> {userData?.userId || "未設定"}
                  </p>
                  <p>
                    <strong>ユーザー名:</strong>{" "}
                    {userData?.username || "未設定"}
                  </p>
                </div>
              </div>

              {/* クイック統計 */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  アカウント概要
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-gray-500 text-sm">ステータス</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      アクティブ
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-gray-500 text-sm">アカウント作成日</p>
                    <p className="text-sm font-bold text-indigo-600">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
