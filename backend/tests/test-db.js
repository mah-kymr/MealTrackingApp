import React, { useState } from "react";
import { getJstTimestamp } from "../utils/time";

const MealTracker = ({ onAddRecord }) => {
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState("");

  const handleStart = () => {
    const startTime = getJstTimestamp();
    setStartTime(startTime);
    setMessage(`開始時刻を記録しました: ${startTime}`);
  };

  const handleEnd = async () => {
    const endTime = getJstTimestamp();
    try {
      const response = await fetch("/api/v1/meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ start_time: startTime, end_time: endTime }),
      });

      if (!response.ok) throw new Error("記録に失敗しました");

      const data = await response.json();

      // duration_minutesのフォーマット
      const duration = `${data.data.duration_minutes.minutes || 0}分 ${data.data.duration_minutes.seconds || 0}秒`;

      // 記録を追加
      onAddRecord({
        startTime: startTime,
        endTime: endTime,
        duration: duration,
      });

      setMessage(`記録が保存されました: ${duration}`);
      setStartTime(null);
    } catch (error) {
      console.error("Error saving meal record:", error);
      setMessage("記録の保存に失敗しました");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-brand-primary mb-4">記録操作</h2>
      <button
        onClick={handleStart}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
      >
        開始
      </button>
      <button
        onClick={handleEnd}
        disabled={!startTime}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 ml-4"
      >
        終了
      </button>
      {startTime && <p className="mt-4">記録中: {startTime}</p>}
      <p className="mt-4 text-brand-secondary">{message}</p>
    </div>
  );
};

export default MealTracker;
