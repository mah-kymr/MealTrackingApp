import React from "react";
import { useNavigate } from "react-router-dom";

const CompletePage = () => {
  const navigate = useNavigate();

  const handleNavigateToDashboard = () => {
    navigate("/DashboardPage");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            登録完了！
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            アカウントの作成が正常に完了しました。
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleNavigateToDashboard}
            className="w-full py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ダッシュボードへ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletePage;
