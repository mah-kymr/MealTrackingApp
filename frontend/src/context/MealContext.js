import React, { createContext, useState, useEffect } from "react";
import { fetchMealCategories } from "../services/meal";

// Contextを作成
export const MealContext = createContext();

// プロバイダコンポーネント
export const MealProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState(null); // **修正: null 初期化でローディングを表現**
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

  // **食事記録を追加**
  const addRecord = (newRecord) => {
    if (!newRecord.start_time || !newRecord.end_time) {
      console.error("❌ 無効な記録データ:", newRecord);
      return;
    }

    setRecords((prevRecords) => [
      {
        ...newRecord,
        start_time: new Date(newRecord.start_time).toISOString(),
        end_time: new Date(newRecord.end_time).toISOString(),
        category_name: getCategoryName(newRecord.category_id),
      },
      ...prevRecords,
    ]);
  };

  // **category_id から category_name を取得**
  const getCategoryName = (category_id) => {
    const category = categories?.find((c) => c.category_id === category_id);
    return category ? category.category_name : "不明";
  };

  return (
    <MealContext.Provider
      value={{ records, addRecord, categories, isLoadingCategories }}
    >
      {children}
    </MealContext.Provider>
  );
};
