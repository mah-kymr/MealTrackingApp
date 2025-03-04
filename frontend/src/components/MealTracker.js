import React, { useContext, useState } from "react";
import { MealContext } from "../context/MealContext";
import { formatTime } from "../utils/time"; // フォーマット関数をインポート

const getJstTimestampIso = () => {
  return new Date().toISOString(); // UTC のまま取得
};

const MealTracker = ({ onAddRecord }) => {
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState("");
  const { categories, isLoadingCategories } = useContext(MealContext);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleStart = () => {
    const startTime = getJstTimestampIso();
    setStartTime(startTime); // 状態として管理
    setMessage(`開始時刻を記録しました: ${formatTime(startTime)}`);
  };

  const handleEnd = async () => {
    if (!selectedCategory) {
      alert("カテゴリを選択してください");
      return;
    }
    if (typeof onAddRecord !== "function") {
      console.error(
        "❌ onAddRecord is not a function. Props might be missing."
      );
      return;
    }

    const endTime = getJstTimestampIso();
    console.log("Request Body:", {
      start_time: startTime,
      end_time: endTime,
      category_id: selectedCategory,
    });

    try {
      const response = await fetch("/api/v1/meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          start_time: startTime,
          end_time: endTime,
          category_id: selectedCategory, // 修正：カテゴリを送信
        }),
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
        start_time: startTime,
        end_time: endTime,
        category_id: selectedCategory,
        duration: durationMinutes,
        interval: intervalMinutes,
      });

      setStartTime(null);
      setSelectedCategory(""); // 選択したカテゴリをリセット
    } catch (error) {
      console.error("Error saving meal record:", error);
      setMessage(`記録の保存に失敗しました: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold text-brand-primary mb-4 text-center">
        食事時間を記録する
      </h2>

      <div className="p-4 border rounded shadow-md bg-white">
        {/* カテゴリ選択 */}
        <label className="block mb-2 font-semibold">食事の種類:</label>
        {isLoadingCategories ? (
          <p>読み込み中...</p>
        ) : categories && categories.length > 0 ? (
          <select
            className="p-2 border rounded w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(parseInt(e.target.value, 10))}
          >
            <option value="">カテゴリを選択</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        ) : (
          <p>カテゴリなし</p>
        )}
      </div>
      <div className="mt-6"></div>
      <div className="flex space-x-4 items-center">
        <button
          onClick={handleStart}
          className="bg-brand-background text-brand-primary
          border border-brand-primary hover:bg-white font-bold py-2 px-4 rounded  focus:outline-none
          focus:shadow-outline focus:shadow-outline"
        >
          開始
        </button>
        <button
          onClick={handleEnd}
          className="bg-brand-secondary text-white font-bold py-2 px-4 rounded hover:bg-brand-accent"
          disabled={!startTime}
        >
          終了
        </button>
      </div>
      {startTime && (
        <p className="mt-4 text-brand-secondary items-center">
          開始時刻:{" "}
          <span className="font-mono font-bold text-lg">
            {formatTime(startTime)}
          </span>
        </p>
      )}

      {message && (
        <p className="mt-2 text-brand-accent font-semibold">{message}</p>
      )}
    </div>
  );
};

export default MealTracker;
