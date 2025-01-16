import React, { createContext, useState } from "react";

// Contextを作成
export const MealContext = createContext();

// プロバイダコンポーネント
export const MealProvider = ({ children }) => {
  const [records, setRecords] = useState([]);

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
