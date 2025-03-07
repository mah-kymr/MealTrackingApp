import React, { createContext, useState, useEffect } from "react";
import { fetchMealCategories } from "../services/meal";

// Contextを作成
export const MealContext = createContext();

// プロバイダコンポーネント
export const MealProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);  // 初期値を空配列に変更
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // **トークンの取得と更新**
  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && storedToken !== token) {
        console.log("✅ トークンを更新:", storedToken);
        setToken(storedToken);
      }
    };

    checkToken();
    window.addEventListener("storage", checkToken); // **他のタブでの変更を監視**
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  // **トークンが `null` の場合は 1 秒ごとにチェック**
  useEffect(() => {
    if (!token) {
      const interval = setInterval(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          console.log("🔄 トークンを再取得:", storedToken);
          setToken(storedToken);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // **カテゴリ取得のトリガー**
  useEffect(() => {
    if (!token) {
      console.warn("⚠️ トークンがないためカテゴリ取得をスキップ");
      setIsLoadingCategories(false);
      return;
    }

    const fetchCategories = async () => {
      console.log("📌 Fetching meal categories...");
      try {
        setIsLoadingCategories(true);
        const categoryData = await fetchMealCategories();
        if (!categoryData || categoryData.length === 0) {
          throw new Error("カテゴリが取得できませんでした");
        }
        console.log("✅ Fetched categories:", categoryData);
        setCategories(categoryData); // **カテゴリを取得してセット**
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
        setCategories([]); // **エラー時は空配列**
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [token]); // **トークンが変更されたときにカテゴリを再取得**

  // 🔵 `interval_minutes` を再計算する関数
  const recalculateDurations = (records) => {
    return records.map((record) => {
      const durationMs =
        new Date(record.end_time) - new Date(record.start_time);
      const durationMinutes = Math.max(1, Math.floor(durationMs / 60000)); // 🔵 1分未満は最低1分とする

      return { ...record, duration_minutes: Math.floor(durationMinutes) };
    });
  };

  const convertToJST = (utcDate) => {
    const date = new Date(utcDate);
    date.setHours(date.getHours() + 9); // 🔵 UTC を JST に変換
    return date.toISOString().split("T")[0]; // 🔵 YYYY-MM-DD の形式で取得
  };

  const fetchMealRecords = async (filter = "monthly") => {
    try {
      const url = `/api/v1/meal/history?filterType=${filter}&timestamp=${Date.now()}`;
      console.log(`🔍 Fetching meal records from: ${url}`);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meal history");
      }

      const result = await response.json();
      console.log("✅ 最新の食事記録を取得:", result.data);

      let recordsWithJST = result.data.map((record) => ({
        ...record,
        record_date: convertToJST(record.start_time),
        interval_minutes:
          record.interval_minutes !== null
            ? record.interval_minutes
            : "データなし", // 🔵 データなしの場合の処理
      }));

      setRecords(recordsWithJST);
    } catch (error) {
      console.error("❌ Error fetching meal history:", error);
    }
  };

  // **食事記録を追加**
  const addRecord = (newRecord) => {
    if (!newRecord.start_time || !newRecord.end_time) {
      console.error("❌ 無効な記録データ:", newRecord);
      return;
    }

    console.log("Adding new record:", newRecord); // 🔍 確認

    setRecords((prevRecords) => [
      {
        ...newRecord,
        start_time: new Date(newRecord.start_time).toISOString(),
        end_time: new Date(newRecord.end_time).toISOString(),
      },
      ...prevRecords,
    ]);
  };

  const handleDeleteRecord = async (record_id) => {
    try {
      console.log(`🗑 削除処理を開始: record_id=${record_id}`);

      const response = await fetch(`/api/v1/meal/${record_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      console.log("✅ 削除成功！データの更新を待機...");

      // 🔄 削除完了後、DB の更新を非同期で待機し、fetchMealRecords() を実行
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("🔄 最新データを取得...");
      fetchMealRecords();
    } catch (error) {
      console.error("❌ Error deleting meal record:", error);
    }
  };

  return (
    <MealContext.Provider
      value={{
        records,
        setRecords,
        addRecord,
        categories,
        isLoadingCategories,
        fetchMealRecords,
        handleDeleteRecord,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};
