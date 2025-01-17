import React, { useState } from "react";

const getJstTimestampIso = () => {
  const date = new Date();
  date.setHours(date.getHours() + 9); // JSTへ変換
  return date.toISOString();
};

const MealTracker = ({ onAddRecord }) => {
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState("");

  const handleStart = () => {
    const startTime = getJstTimestampIso() || "";  // ISO形式のを取得&デフォルト値（空文字列）設定
    setStartTime(startTime); // 状態として管理
    setMessage(`開始時刻を記録しました: ${startTime}`);
  };

  const handleEnd = async () => {
    const endTime = getJstTimestampIso() || ""; // ISO形式の終了時刻を取得&デフォルト値（空文字列）設定

    // ログ: リクエストボディを確認
    console.log("Request Body:", { start_time: startTime, end_time: endTime });

    try {
      const response = await fetch("/api/v1/meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ start_time: startTime, end_time: endTime }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Server Error:", responseData);
        throw new Error(responseData.message || "記録に失敗しました");
      }

      console.log("Response data:", responseData);

      const durationMinutes = responseData.data?.duration_minutes;
      const intervalMinutes = responseData.data?.interval_minutes;

      if (!durationMinutes) {
        throw new Error("レスポンスにフォーマット済みデータが含まれていません");
      }

      setMessage(
        `記録が保存されました: ${Math.floor(durationMinutes / 60)}時間 ${
          durationMinutes % 60
        }分`
      );
      onAddRecord({
        startTime: startTime,
        endTime: endTime,
        duration: durationMinutes,
        interval: intervalMinutes,
      });

      setStartTime(null);
    } catch (error) {
      console.error("Error saving meal record:", error);
      setMessage("記録の保存に失敗しました");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-brand-primary mb-4">
        食事時間を記録する
      </h2>
      <div className="flex space-x-4">
        <button
          onClick={handleStart}
          className="bg-brand-secondary text-white font-bold py-2 px-4 rounded hover:bg-brand-accent"
        >
          開始
        </button>
        <button
          onClick={handleEnd}
          className="bg-brand-background text-brand-primary
          border border-brand-primary hover:bg-white font-bold py-2 px-4 rounded  focus:outline-none
          focus:shadow-outline focus:shadow-outline"
          disabled={!startTime}
        >
          終了
        </button>
        {startTime && (
          <p className="mb-4 text-brand-secondary">開始時刻: {startTime}</p>
        )}
      </div>
    </div>
  );
};

export default MealTracker;
