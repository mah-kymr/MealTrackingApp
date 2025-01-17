import React from "react";
import { formatDate, formatTime } from "../utils/time";

const MealRecordList = ({ records }) => {
  // データの確認
  console.log("Meal records:", records);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((record, index) => {
        // 各recordの値をログ出力
        console.log(`Record ${index + 1}:`, {
          duration: record.duration,
          interval: record.interval,
          startTime: record.startTime,
          endTime: record.endTime,
        });

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
                {record.startTime ? formatTime(record.startTime) : "データなし"}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-600">終了時刻: </span>
              <span className="font-mono font-bold text-gray-800">
                {record.endTime ? formatTime(record.endTime) : "データなし"}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-600">所要時間: </span>
              <span className="font-mono font-bold text-gray-800">
                {record.duration
                  ? `${Math.floor(Number(record.duration) / 60)}時間 ${
                      Number(record.duration) % 60
                    }分`
                  : "データなし"}
              </span>
            </p>
            {record.interval !== null && (
              <p>
                <span className="font-semibold text-gray-600">食事間隔: </span>
                <span className="font-mono font-bold text-gray-800">
                  {`${Math.floor(Number(record.interval) / 60)}時間 ${
                    Number(record.interval) % 60
                  }分`}
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
