import React, { useContext } from "react";
import { formatToLocalTime } from "../utils/time";
import { MealContext } from "../context/MealContext";

const MealRecordList = ({ records }) => {
  console.log("Meal records received from server:", records); // 全体のデータを確認

  const { categories } = useContext(MealContext); // カテゴリ一覧を取得

  // category_id を category_name に変換する関数
  const getCategoryName = (category_id) => {
    if (!categories) return "不明"; // categories が null の場合は「不明」を返す
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

        // 所要時間の計算（`duration_minutes` を使用）
        const durationHours = Math.floor(record.duration_minutes / 60);
        const durationMinutes = record.duration_minutes % 60;
        const formattedDuration =
          record.duration_minutes && !isNaN(record.duration_minutes) ? (
            <>
              {durationHours > 0 && (
                <>
                  <span className="font-bold text-gray-800">
                    {durationHours}
                  </span>
                  <strong className="font-semibold text-brand-primary">
                    {" "}
                    時間
                  </strong>{" "}
                </>
              )}
              <span className="font-mono font-bold text-gray-800">
                {durationMinutes}
              </span>
              <strong className="font-semibold text-brand-primary"> 分</strong>
            </>
          ) : (
            "データなし"
          );

        // 食事間隔の計算（`interval_minutes` を使用）
        const intervalHours = Math.floor(record.interval_minutes / 60);
        const intervalMinutes = record.interval_minutes % 60;
        const formattedInterval =
          record.interval_minutes && !isNaN(record.interval_minutes) ? (
            <>
              {intervalHours > 0 && (
                <>
                  <span className="font-bold text-gray-800">
                    {intervalHours}
                  </span>
                  <strong className="font-semibold text-brand-primary">
                    {" "}
                    時間
                  </strong>{" "}
                </>
              )}
              <span className="font-mono font-bold text-gray-800">
                {intervalMinutes}
              </span>
              <strong className="font-semibold text-brand-primary"> 分</strong>
            </>
          ) : (
            "データなし"
          );

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
                {formattedDuration}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-600">食事間隔: </span>
              <span className="font-mono font-bold text-gray-800">
                {formattedInterval}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
};
export default MealRecordList;
