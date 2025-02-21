import React, { useEffect, useState } from "react";
import { formatToLocalDate, formatToLocalTime } from "../utils/time";

const MealHistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("daily"); // フィルターの初期値は「日別」

  useEffect(() => {
    const fetchMealHistory = async () => {
      try {
        const response = await fetch(
          `/api/v1/meal/history?filterType=${filter}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();

        if (response.ok) {
          setRecords(result.data);
        } else {
          console.error("Failed to fetch meal history:", result.message);
        }
      } catch (error) {
        console.error("Error fetching meal history:", error);
      }
    };

    fetchMealHistory();
  }, [filter]); // フィルターが変更されたら再取得

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">食事記録の履歴</h2>

        {/* フィルターセレクター */}
        <div className="mb-4">
          <label className="mr-4">フィルター:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="daily">日別</option>
            <option value="weekly">週別</option>
            <option value="monthly">月別</option>
          </select>
        </div>

        {/* 食事記録一覧 */}
        <div className="space-y-4">
          {records.length === 0 ? (
            <p className="text-gray-500">記録がありません</p>
          ) : (
            records.map((record) => (
              <div key={record.record_id} className="border p-4 rounded">
                <p>
                  <strong>記録日:</strong>{" "}
                  {formatToLocalDate(record.start_time)}
                </p>
                <p>
                  <strong>開始時刻:</strong>{" "}
                  {formatToLocalTime(record.start_time)}
                </p>
                <p>
                  <strong>終了時刻:</strong>{" "}
                  {formatToLocalTime(record.end_time)}
                </p>
                <p>
                  <strong>所要時間:</strong> {record.duration_minutes} 分
                </p>
                <p>
                  <strong>食事間隔:</strong> {record.interval_minutes} 分
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MealHistoryPage;
