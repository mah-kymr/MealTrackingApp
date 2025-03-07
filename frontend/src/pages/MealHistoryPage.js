import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HistoryHeader from "../components/HistoryHeader";
import MealHistoryList from "../components/MealHistoryList";
import { fetchMealCategories } from "../services/meal";
import { MealContext } from "../context/MealContext";

const MealHistoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("monthly"); // フィルターの初期値は「日別」
  const navigate = useNavigate();
  const { records, setRecords, fetchMealRecords } = useContext(MealContext);

  // **fetchMealRecords() を useCallback でメモ化**
  const fetchRecordsWithFilter = useCallback(() => {
    fetchMealRecords(filter);
  }, [fetchMealRecords, filter]); // 🔵 `fetchMealRecords` と `filter` を依存配列に追加

  // **初回データ取得 & フィルター変更時**
  useEffect(() => {
    fetchMealRecords(filter); // 🔵 `filterType` を適用
  }, [filter]); // 🔵 `filter` の変更時のみ再取得

  // カテゴリを取得
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await fetchMealCategories();
      console.log("🟢 [MealHistoryPage] Fetched categories:", data);
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // 記録を削除する
  const handleDeleteRecord = async (record_id) => {
    try {
      console.log(`🗑️ Deleting meal record: ${record_id}`);

      const response = await fetch(`/api/v1/meal/${record_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      console.log("✅ 削除完了！最新データを取得...");

      // 🔵 1. まずAPIの成功を確認してから `setRecords()` を実行
      setRecords((prevRecords) =>
        prevRecords.filter((r) => r.record_id !== record_id)
      );

      // 🔵 2. 現在の `filter` を考慮して最新データを取得
      await fetchMealRecords(filter);
    } catch (error) {
      console.error("❌ Error deleting meal record:", error);
    }
  };

  // 記録を更新する
  const handleUpdateRecord = async (record_id, updatedData) => {
    try {
      console.log(`✏️ Updating meal record: ${record_id}`);

      const response = await fetch(`/api/v1/meal/${record_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update record");
      }

      const updatedRecord = await response.json();
      console.log("✅ 更新完了！即時反映 & 最新データを取得...");

      // 🔵 1. まずフロントエンドの state を即時更新
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.record_id === record_id ? updatedRecord.data : record
        )
      );

      // 🔵 2. 現在の `filter` に応じて最新データを取得
      await fetchMealRecords(filter);
    } catch (error) {
      console.error("❌ Error updating meal record:", error);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* ヘッダー */}
        <HistoryHeader onBack={() => navigate("/dashboard")} />

        {/* メインコンテンツ */}
        <div className="p-6 space-y-6">
          {/* フィルターセレクター */}
          <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
            <label className="text-xl font-semibold text-brand-primary mb-6">
              日別・週別・月別 を切り替える
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded bg-brand-background pt-2"
            >
              <option value="daily">日別 （当日の記録のみ表示）</option>
              <option value="weekly">週別 （過去７日間の記録を表示）</option>
              <option value="monthly">月別 （過去３０日間の記録を表示）</option>
            </select>
          </div>

          {/* 食事記録一覧 */}
          <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
            <label className="text-xl font-semibold text-brand-primary mb-6">
              履歴一覧
            </label>
            <MealHistoryList
              records={records}
              categories={categories}
              onUpdate={handleUpdateRecord}
              onDelete={handleDeleteRecord}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealHistoryPage;
