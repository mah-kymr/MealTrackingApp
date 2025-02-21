import React, { createContext, useState, useEffect } from "react";

// Contextを作成
export const MealContext = createContext();

// プロバイダコンポーネント
export const MealProvider = ({ children }) => {
  const [records, setRecords] = useState([]);

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

  // 新しい記録を追加する関数
  const addRecord = (newRecord) => {
    setRecords((prevRecords) => [newRecord, ...prevRecords]);
  };

  return (
    <MealContext.Provider value={{ records, addRecord }}>
      {children}
    </MealContext.Provider>
  );
};
