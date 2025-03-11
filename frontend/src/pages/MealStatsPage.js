import React, { useContext, useEffect } from "react";
import { MealContext } from "../context/MealContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const MealStatsPage = () => {
  const { records } = useContext(MealContext);

  // ✅ `records` の状態をコンソールに出力
  useEffect(() => {
    console.log("📌 `MealStatsPage` で `MealContext.records` を取得:", records);
  }, [records]);

  // ✅ 1週間の食事回数データを集計
  const getMealData = () => {
    console.log("📌 `getMealData()` を実行");

    if (!records || records.length === 0) {
      console.log("⚠️ `records` が空のため、データがありません");
      return [];
    }

    const mealCounts = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      mealCounts[formattedDate] = 0;
    }

    records.forEach((record) => {
      const recordDate = new Date(record.start_time)
        .toISOString()
        .split("T")[0];
      if (mealCounts.hasOwnProperty(recordDate)) {
        mealCounts[recordDate] += 1;
      }
    });

    console.log("🟢 `getMealData()` のデータ:", mealCounts);

    return Object.keys(mealCounts).map((date) => ({
      date,
      meals: mealCounts[date],
    }));
  };

  const data = getMealData();

  // ✅ 1日の食事間隔データを計算
  const getMealIntervals = () => {
    const sortedRecords = [...records]
      .filter((r) => r.start_time && r.end_time) // ✅ `start_time` と `end_time` があるデータのみ対象
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    if (sortedRecords.length < 2) {
      return []; // ✅ データが少なすぎる場合は空の配列を返す
    }

    const intervals = sortedRecords.map((record, index) => {
      const startTime = new Date(record.start_time);
      const prevEndTime =
        index > 0 ? new Date(sortedRecords[index - 1].end_time) : null;
      const diff = prevEndTime ? (startTime - prevEndTime) / (1000 * 60) : 0; // 分単位の間隔

      return {
        time: startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }), // ✅ `HH:mm` 形式
        interval: diff,
      };
    });

    return intervals;
  };

  const intervalData = getMealIntervals();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        📊 食事データの可視化
      </h1>

      {/* ✅ 1週間の食事回数グラフ */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4 text-center">
          📅 1週間の食事回数
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="meals"
              stroke="#c85b7d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ 1日の食事間隔グラフ */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-center">
          ⏳ 1日の食事間隔
        </h2>
        {intervalData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={intervalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="interval" fill="#c85b7d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">
            食事間隔のデータがありません
          </p>
        )}
      </div>
    </div>
  );
};

export default MealStatsPage;
