import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { MealContext } from "../context/MealContext";
import MealTracker from "../components/MealTracker";
import MealRecordList from "../components/MealRecordList";

const DashboardPage = () => {
  // ユーザー情報とローディング状態を管理
  const { records, addRecord } = useContext(MealContext);
  const { userData, isLoading, error } = useUserProfile();

  // ページ遷移のためのナビゲーションフック
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleGoToProfile = () => {
    navigate("/profile");
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
            <MealTracker onAddRecord={addRecord} />
            {/* 記録結果区画 */}
            <MealRecordList records={records} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
