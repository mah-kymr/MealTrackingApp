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
          console.log("トークンは有効です");
          setIsTokenValid(true);
        } else {
          // トークンが無効な場合
          console.log("トークンは無効です");
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
      navigate("/Dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-4xl font-extrabold text-brand-primary mb-6">
            登録完了！
          </h2>
          <p className="text-lg text-brand-secondary mb-8">
            アカウントの作成が正常に完了しました。
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleNavigateToDashboard}
            className="w-full bg-brand-secondary 
            hover:bg-brand-accent 
            text-white 
            py-2 
            px-4 
            rounded"
          >
            ダッシュボードへ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletePage;
