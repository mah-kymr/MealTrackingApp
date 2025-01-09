// DashboardPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MealRecordSection = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [message, setMessage] = useState("");

  const handleStart = () => {
    setStartTime(new Date().toISOString());
    setMessage("食事の開始時刻を記録しました！");
  };

  const handleEnd = async () => {
    const now = new Date().toISOString();
    setEndTime(now);

    try {
      const response = await fetch("/api/v1/meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ start_time: startTime, end_time: now }),
      });

      if (!response.ok) {
        throw new Error("記録の保存に失敗しました");
      }

      setMessage("食事記録が保存されました！");
    } catch (error) {
      setMessage("エラー: 記録の保存に失敗しました。");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-brand-primary mb-4">
        食事時間を記録する
      </h2>
      <p className="mb-4 text-brand-secondary">{message}</p>
      <div className="flex space-x-4">
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          開始
        </button>
        <button
          onClick={handleEnd}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
          disabled={!startTime}
        >
          終了
        </button>
      </div>
    </div>
  );
};

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
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
            <div>
              <button
                onClick={handleGoToProfile}
                className="mr-4 bg-white text-brand-primary hover:bg-brand-background font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                プロフィール
              </button>
              <button
                onClick={handleLogout}
                className="bg-white text-brand-primary hover:bg-brand-background font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                ログアウト
              </button>
            </div>
          </div>

          {/* ユーザー情報セクション */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 個人情報 */}
              <div className="bg-brand-background rounded-lg p-6">
                <h2 className="text-xl font-semibold text-brand-accent mb-4">
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
              <div className="bg-brand-background rounded-lg p-6">
                <h2 className="text-xl font-semibold text-brand-accent mb-4">
                  アカウント概要
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-gray-500 text-sm">ステータス</p>
                    <p className="text-2xl font-bold text-brand-primary">
                      アクティブ
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-gray-500 text-sm">アカウント作成日</p>
                    <p className="text-sm font-bold text-brand-primary">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 記録コーナーの追加 */}
          <div className="p-6 space-y-6">
            <MealRecordSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
