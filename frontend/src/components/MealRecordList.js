import React from "react";
import { formatDate, formatTime } from "../utils/time";
import { formatToLocalTime } from "../utils/time";

const MealRecordList = ({ records }) => {
  // データ形式の確認ログ
  console.log("Meal records received from server:", records); // 全体のデータを確認

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((record, index) => {
        console.log(`Record ${index + 1}:`, record); // 各レコードのデータを確認

        // デバッグログ: タイムゾーン変換結果を確認
        console.log("Raw startTime (from server):", record.startTime);
        console.log("Parsed UTC Date:", new Date(record.startTime));
        console.log(
          "Corrected startTime (JST):",
          formatToLocalTime(record.startTime)
        );
        console.log(
          "System time (JST):",
          new Date().toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" })
        );
        console.log("Raw record from server:", record);
        console.log("Duration (from server):", record.duration);
        console.log("Interval (from server):", record.interval);

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
              <span className="font-semibold text-gray-600">開始時刻: </span>
              <span className="font-mono font-bold text-gray-800">
                {record.startTime
                  ? formatToLocalTime(record.startTime)
                  : "データなし"}{" "}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-600">終了時刻: </span>
              <span className="font-mono font-bold text-gray-800">
                {record.endTime
                  ? formatToLocalTime(record.endTime)
                  : "データなし"}{" "}
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
                    ? `${Math.floor(record.interval / 60)}時間 ${
                        record.interval % 60
                      }分`
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
