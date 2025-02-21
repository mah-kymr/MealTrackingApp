import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryHeader from "../components/HistoryHeader";
import MealHistoryList from "../components/MealHistoryList";

const MealHistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("daily"); // フィルターの初期値は「日別」
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* コンポーネント・ヘッダー */}
        <HistoryHeader onBack={() => navigate("/dashboard")} />

        {/* メインコンテンツ */}
        <div className="p-6 space-y-6">
          {/* フィルターセレクター */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <label className="text-xl font-semibold text-brand-primary mb-4">
              日別・週別・月別 を切り替える
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded bg-brand-background"
            >
              <option value="daily">日別</option>
              <option value="weekly">週別</option>
              <option value="monthly">月別</option>
            </select>
          </div>

          {/* 食事記録一覧 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <MealHistoryList records={records} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealHistoryPage;
