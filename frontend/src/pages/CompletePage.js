import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CompletePage = () => {
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false); // デフォルトはfalseにする
  const [token, setToken] = useState(localStorage.getItem("token"));

  // トークン検証用のAPIを呼び出して、トークンが有効か確認
  useEffect(() => {
    console.log("Current token:", token); // デバッグ用ログ

    if (!token) {
      navigate("/login"); // トークンがない場合はログインページにリダイレクト
      return;
    }

    const verifyToken = async () => {
      try {
        // トークン検証用のバックエンドエンドポイントを呼び出し
        const response = await fetch("/api/v1/auth/verify", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Verify token response:", response.status); // デバッグ用ログ

        if (response.ok) {
          // レスポンスが成功した場合のみトークンを有効とする
          setIsTokenValid(true);
        } else {
          // トークンが無効な場合
          localStorage.removeItem("token"); // トークンを削除
          navigate("/login");
        }
      } catch (error) {
        console.error("トークン検証エラー:", error);
        setIsTokenValid(false);
        navigate("/login");
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleNavigateToDashboard = () => {
    // トークンが有効であればダッシュボードへ遷移
    if (isTokenValid) {
      navigate("/DashboardPage");
    }
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
