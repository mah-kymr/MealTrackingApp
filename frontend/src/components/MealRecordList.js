import React from "react";
import { formatTime } from "../utils/time";

const MealRecordList = ({ records }) => {
  // データ形式の確認ログ
  console.log("Meal records received from server:", records); // 全体のデータを確認

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((record, index) => {
        console.log(`Record ${index + 1}:`, record);
        console.log("Raw start_time from server:", record.startTime);
        console.log("Raw end_time from server:", record.endTime);

        const formattedStartTime = record.startTime
          ? formatTime(record.startTime)
          : "データなし";
        const formattedEndTime = record.endTime
          ? formatTime(record.endTime)
          : "データなし";

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
