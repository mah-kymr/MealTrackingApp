import React, { createContext, useState, useEffect } from "react";
import { fetchMealCategories } from "../services/meal";

// Contextを作成
export const MealContext = createContext();

// プロバイダコンポーネント
export const MealProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]); // 食事カテゴリの状態

  // APIから食事記録を取得する関数
  useEffect(() => {
    const fetchMealRecords = async () => {
      try {
        const response = await fetch("/api/v1/meal", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();

        console.log("Meal records fetched:", result); // デバッグ用ログ

        if (response.ok && result.data) {
          setRecords(result.data);
        } else {
          console.error("Failed to fetch records:", result.message);
        }
      } catch (error) {
        console.error("Error fetching meal records:", error);
      }
    };

    fetchMealRecords();
  }, []); // 初回レンダリング時のみ実行

  // APIから食事カテゴリを取得する関数
  useEffect(() => {
    const fetchCategories = async () => {
      console.log("Fetching meal categories..."); // デバッグログ
      const categoryData = await fetchMealCategories();
      console.log("Fetched categories:", categoryData); // デバッグログ
      setCategories(categoryData);
    };

    fetchCategories();
  }, []);

  // 新しい記録を追加する関数
  const addRecord = (newRecord) => {
    if (!newRecord.start_time || !newRecord.end_time) {
      console.error("❌ 無効な記録データ:", newRecord);
      return; // 無効なデータは追加しない
    }

    try {
      const formattedStartTime = new Date(newRecord.start_time).toISOString();
      const formattedEndTime = new Date(newRecord.end_time).toISOString();

      setRecords((prevRecords) => [
        {
          ...newRecord,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
        },
        ...prevRecords,
      ]);
    } catch (error) {
      console.error("❌ 時間の変換エラー:", error);
    }
  };

  return (
    <MealContext.Provider value={{ records, addRecord, categories }}>
      {children}
    </MealContext.Provider>
  );
};
