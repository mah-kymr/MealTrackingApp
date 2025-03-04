import React, { useState } from "react";
import { formatToLocalDate, formatToLocalTime } from "../utils/time";
import EditMealModal from "./EditMealModal"; // 編集用モーダルをインポート
import DeleteMealModal from "./DeleteMealModal"; // 削除用モーダルをインポート

const MealHistoryList = ({ records, categories, onUpdate, onDelete }) => {
  const [editRecord, setEditRecord] = useState(null); // 編集対象の記録
  const [deleteRecord, setDeleteRecord] = useState(null); // 削除対象の記録

  if (!records || records.length === 0) {
    return <p className="text-gray-500">記録がありません</p>;
  }

  // category_id から category_name を取得する関数
  const getCategoryName = (category_id) => {
    const category = categories.find((c) => c.category_id === category_id);
    return category ? category.category_name : "不明";
  };

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
                食事カテゴリ:
              </strong>{" "}
              <span className="font-mono font-bold text-gray-800">
                {getCategoryName(record.category_id)}
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

            {/* 編集・削除ボタン */}
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setEditRecord(record)}
                className="bg-brand-background text-brand-primary
          border border-brand-primary hover:bg-white py-2 px-4 rounded  focus:outline-none
          focus:shadow-outline focus:shadow-outline"
              >
                編集
              </button>
              <button
                onClick={() => setDeleteRecord(record)}
                className="bg-brand-secondary text-white py-2 px-4 rounded hover:bg-brand-accent"
              >
                削除
              </button>
            </div>
          </div>
        );
      })}

      {/* 編集モーダル */}
      {editRecord && (
        <EditMealModal
          record={editRecord}
          categories={categories}
          onClose={() => setEditRecord(null)}
          onUpdate={onUpdate}
        />
      )}

      {/* 削除モーダル */}
      {deleteRecord && (
        <DeleteMealModal
          record={deleteRecord}
          categories={categories}
          onClose={() => setDeleteRecord(null)}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default MealHistoryList;
