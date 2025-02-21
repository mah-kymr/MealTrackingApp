import React from "react";
import { formatToLocalDate, formatToLocalTime } from "../utils/time";

const MealHistoryList = ({ records }) => {
  if (!records || records.length === 0) {
    return <p className="text-gray-500">記録がありません</p>;
  }

  return (
    <div className="space-y-4">
      {records.map((record) => {
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

        return (
          <div
            key={record.record_id}
            className="bg-brand-background rounded-lg p-6 shadow-md"
          >
            <p className="text-lg font-bold text-gray-800 mb-4">
              <strong>記録日:</strong>{" "}
              <span className="font-mono font-bold text-gray-800">
                {formatToLocalDate(record.start_time)}
              </span>
            </p>
            <p>
              <strong className="font-semibold text-brand-primary">
                開始時刻 :
              </strong>{" "}
              <span className="font-mono font-bold text-gray-800">
                {formatToLocalTime(record.start_time)}
              </span>
            </p>
            <p>
              <strong className="font-semibold text-brand-primary">
                終了時刻 :
              </strong>{" "}
              <span className="font-mono font-bold text-gray-800">
                {formatToLocalTime(record.end_time)}
              </span>
            </p>
            <p>
              <strong className="font-semibold text-brand-primary">
                所要時間 :
              </strong>{" "}
              <span className="font-mono font-bold text-gray-800">
                {formattedDuration}
              </span>{" "}
            </p>
            <p>
              <strong className="font-semibold text-brand-primary">
                食事間隔 :
              </strong>{" "}
              <span className="font-mono font-bold text-gray-800">
                {formattedInterval}
              </span>{" "}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MealHistoryList;
