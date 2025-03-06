import React, { useContext } from "react";
import { formatToLocalTime } from "../utils/time";
import { MealContext } from "../context/MealContext";

const MealRecordList = ({ records }) => {
  console.log("Meal records received from server:", records); // 全体のデータを確認

  const { categories } = useContext(MealContext); // カテゴリ一覧を取得

  // category_id を category_name に変換する関数
  const getCategoryName = (category_id) => {
    const category = categories.find((c) => c.category_id === category_id);
    return category ? category.category_name : "不明";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((record, index) => {
        console.log(`Record ${index + 1}:`, record);
        console.log("Raw start_time from server:", record.startTime);
        console.log("Raw end_time from server:", record.endTime);

        const formattedStartTime =
          record.start_time && record.start_time !== "null"
            ? formatToLocalTime(record.start_time)
            : "記録なし";
        const formattedEndTime =
          record.end_time && record.end_time !== "null"
            ? formatToLocalTime(record.end_time)
            : "記録なし";

        console.log("Formatted start_time (UTC HH:mm):", formattedStartTime);
        console.log("Formatted end_time (UTC HH:mm):", formattedEndTime);

        return (
          <div
            key={record.record_id || `record-${index}`}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              食事記録 #{record.record_id || index + 1}
            </h3>
            <p className="mb-2"></p>
            <p>
              <span className="font-semibold text-gray-600">
                食事カテゴリ:{" "}
              </span>
              <span className="font-mono font-bold text-gray-800">
                {getCategoryName(record.category_id)}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-600">開始時刻: </span>
              <span className="font-mono font-bold text-gray-800">
                {formattedStartTime}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-600">終了時刻: </span>
              <span className="font-mono font-bold text-gray-800">
                {formattedEndTime}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-600">所要時間: </span>
              <span className="font-mono font-bold text-gray-800">
                {record.duration && !isNaN(record.duration)
                  ? `${Math.floor(record.duration / 60)}時間 ${
                      record.duration % 60
                    }分`
                  : "データなし"}
              </span>
            </p>
            {record.interval !== null && (
              <p>
                <span className="font-semibold text-gray-600">食事間隔: </span>
                <span className="font-mono font-bold text-gray-800">
                  {record.interval && !isNaN(record.interval)
                    ? `${Math.floor(record.interval / 60)}時間 ${Math.round(
                        record.interval % 60
                      )}分`
                    : "データなし"}
                </span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default MealRecordList;
