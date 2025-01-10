import React from "react";
import { formatDate, formatTime } from "../utils/time";

const MealRecordList = ({ records }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-brand-primary mb-4">
        食事時間を確認する
      </h2>
      {records.length === 0 ? (
        <p>まだ記録がありません。食事時間を記録してみましょう！</p>
      ) : (
        <ul className="space-y-4">
          {records.map((record, index) => (
            <li
              key={index}
              className="p-4 border border-gray-300 rounded-lg shadow-sm"
            >
              {/* 日付をカード内に1箇所だけ表示 */}
              <p className="font-bold text-lg mb-2">
                {formatDate(record.startTime)}
              </p>
              <div className="space-y-1">
                <p>開始時刻: {formatTime(record.startTime)}</p>
                <p>終了時刻: {formatTime(record.endTime)}</p>
                <p>食事時間: {formatTime(record.duration)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MealRecordList;