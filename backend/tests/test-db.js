import React, { useState } from "react";
import { getJstTimestamp } from "../utils/time"; // JSTタイムスタンプ関数をインポート

const MealTracker = () => {
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
      setMessage(`記録が保存されました: ${data.data.duration_minutes}`);
      setStartTime(null); // 開始時刻をリセット
    } catch (error) {
      console.error("Error saving meal record:", error);
      setMessage("記録の保存に失敗しました");
    }
  };

  return (
    <div>
      <button onClick={handleStart}>開始</button>
      <button onClick={handleEnd} disabled={!startTime}>終了</button>
      {startTime && <p>記録中: {startTime}</p>}
      <p>{message}</p>
    </div>
  );
};

export default MealTracker;
