// DashboardPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MealTracker from "../components/MealTracker";
import MealRecordList from "../components/MealRecordList";

const DashboardPage = () => {
  // ユーザー情報とローディング状態を管理
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);

  // ページ遷移のためのナビゲーションフック
  const navigate = useNavigate();

  // 新しい記録を先頭に追加
  const handleAddRecord = (newRecord) => {
    setRecords([newRecord, ...records]);
  };

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

        if (!token) {
          navigate("/");
          return;
        }

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
        console.log("Response headers:", response.headers);

        // レスポンスが正常でない場合はエラーをスロー
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Error Response:", errorData);
          throw new Error(
            errorData.message || "プロファイル取得に失敗しました"
          );
        }

        // JSONとしてパース
        const data = await response.json();
        console.log("Received data:", data);

        // ユーザーデータをステートに設定
        setUserData({
          userId: data.user.user_id,
          username: data.user.username,
        });
      } catch (err) {
        // エラーの詳細をログ出力
        console.error("Fetch Error Details:", err);
        setError(err.message);
        localStorage.removeItem("token");
        navigate("/"); // エラー時にログインページにリダイレクト
      } finally {
        // ローディング状態を解除
        setIsLoading(false);
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

  // プロフィールページへの遷移ハンドラ
  const handleGoToProfile = () => {
    navigate("/profile"); // プロフィールページに遷移
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <div className="text-center">
          <p className="text-xl text-brand-secondary">読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー発生時の表示
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-center text-2xl font-bold text-brand-accent mb-4">
              エラーが発生しました
            </h2>
            <p className="text-center text-gray-700">{error}</p>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLogout}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
    <div className="min-h-screen bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* ダッシュボードヘッダー */}
          <div className="bg-brand-secondary text-white px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {userData?.username
                ? `${userData.username} さんの記録`
                : "ダッシュボード"}
            </h1>
            <div>
              <button
                onClick={handleGoToProfile}
                className="mr-4 bg-white text-brand-primary hover:bg-brand-background font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                プロフィール管理
              </button>
              <button
                onClick={handleLogout}
                className="bg-white text-brand-primary hover:bg-brand-background font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                ログアウト
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* 記録操作区画 */}
            <MealTracker onAddRecord={handleAddRecord} />
            {/* 記録結果区画 */}
            <MealRecordList records={records} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
