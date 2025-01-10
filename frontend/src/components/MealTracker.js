import React, { useState } from "react";
import { getJstTimestamp, formatTime } from "../utils/time"; // JSTタイムスタンプ関数をインポート

const MealTracker = ({ onAddRecord }) => {
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState("");

  const handleStart = () => {
    const startTime = getJstTimestamp(); // JSTの開始時刻を取得
    setStartTime(startTime); // 状態として管理
    setMessage(`開始時刻を記録しました: ${startTime}`);
  };

  const handleEnd = async () => {
    const endTime = getJstTimestamp(); // JSTの終了時刻を取得

    try {
      const response = await fetch("/api/v1/meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ start_time: startTime, end_time: endTime }),
      });

      if (!response.ok) {
        throw new Error("記録に失敗しました");
      }

      const data = await response.json();

      // duration_minutesのフォーマット（時間と分のみ）
      const duration = `${data.data.duration_minutes.minutes || 0}分`;

      // 記録を追加
      onAddRecord({
        startTime: startTime,
        endTime: endTime,
        duration: duration,
      });

      setMessage(`記録が保存されました: ${duration}`);
      setStartTime(null); // 開始時刻をリセット
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
          className="bg-brand-background text-brand-primary font-bold py-2 px-4 rounded hover:bg-white focus:outline-none
          focus:shadow-outline"
          disabled={!startTime}
        >
          終了
        </button>
        {startTime && (
          <p className="mb-4 text-brand-secondary">
            開始時刻: {formatTime(startTime)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MealTracker;
