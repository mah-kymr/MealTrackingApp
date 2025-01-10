import React from "react";

const MealRecordList = ({ records }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-brand-primary mb-4">食事時間を確認する</h2>
      {records.length === 0 ? (
        <p>記録がありません。</p>
      ) : (
        <ul className="space-y-4">
          {records.map((record, index) => (
            <li
              key={index}
              className="p-4 border border-gray-300 rounded-lg shadow-sm"
            >
              <p>開始時刻: {record.startTime}</p>
              <p>終了時刻: {record.endTime}</p>
              <p>食事時間: {record.duration}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MealRecordList;
