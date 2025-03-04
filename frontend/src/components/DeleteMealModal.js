import React from "react";
import { formatToLocalDate, formatToLocalTime } from "../utils/time";

const DeleteMealModal = ({ record, categories = [], onClose, onDelete }) => {
  if (!record) return null;

  console.log("🟢 [DeleteMealModal] categories:", categories);
  console.log("🟢 [DeleteMealModal] record.category_id:", record.category_id);

  // category_id から category_name を取得する関数
  const getCategoryName = (category_id) => {
    if (!categories || categories.length === 0) {
      console.warn("⚠️ [DeleteMealModal] カテゴリが未取得");
      return "カテゴリなし";
    }

    const category = categories.find(
      (c) => Number(c.category_id) === Number(category_id)
    );

    if (!category) {
      console.warn(
        "⚠️ [DeleteMealModal] category_id に該当するカテゴリが見つかりません:",
        category_id
      );
      return "不明";
    }

    return category.category_name;
  };

  const handleDelete = async () => {
    await onDelete(record.record_id);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold text-brand-primary mb-4">
          記録の削除
        </h2>
        <p className="mb-4">本当にこの記録を削除してもよろしいですか？</p>

        <p className="text-gray-700">
          <strong>食事カテゴリ:</strong> <span className="font-mono font-bold text-gray-800">{getCategoryName(record.category_id)}</span>
        </p>
        <p className="text-gray-700">
          <strong>開始時刻:</strong> <span className="font-mono font-bold text-gray-800">{formatToLocalDate(record.start_time)}{" "}
          {formatToLocalTime(record.start_time)}</span>
        </p>
        <p className="text-gray-700">
          <strong>終了時刻:</strong> <span className="font-mono font-bold text-gray-800">{formatToLocalDate(record.end_time)}{" "}
          {formatToLocalTime(record.end_time)}</span>
        </p>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-brand-background text-brand-primary
          border border-brand-primary hover:bg-white py-2 px-4 rounded  focus:outline-none
          focus:shadow-outline focus:shadow-outline"
          >
            キャンセル
          </button>
          <button
            onClick={handleDelete}
            className="bg-brand-secondary text-white py-2 px-4 rounded hover:bg-brand-accent"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMealModal;
