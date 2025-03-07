import React, { useState } from "react";

const formatDateTimeLocal = (isoString) => {
  const date = new Date(isoString);
  date.setHours(date.getHours() + 9); // 🔥 JSTに変換
  return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm 形式
};

const EditMealModal = ({ record, categories, onClose, onUpdate }) => {
  const [startTime, setStartTime] = useState(
    formatDateTimeLocal(record.start_time)
  );
  const [endTime, setEndTime] = useState(formatDateTimeLocal(record.end_time));
  const [categoryId, setCategoryId] = useState(record.category_id);

  const handleSubmit = async () => {
    const updatedData = {
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      category_id: categoryId,
    };

    console.log("Updating meal record:", updatedData); // 🔍 確認

    try {
      await onUpdate(record.record_id, updatedData);
      console.log("✅ 更新成功:", updatedData);
    } catch (error) {
      console.error("❌ 更新エラー:", error);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold text-brand-primary mb-4">
          記録の編集
        </h2>

        <label className="block text-gray-700 font-semibold mb-2">
          開始時間:
        </label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-3 border border-brand-primary rounded-lg bg-brand-background text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent shadow-sm"
        />

        <label className="block text-gray-700 font-semibold mt-4 mb-2">
          終了時間:
        </label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-3 border border-brand-primary rounded-lg bg-brand-background text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent shadow-sm"
        />

        <label className="block text-gray-700 font-semibold mt-4 mb-2">
          食事カテゴリ:
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-3 border border-brand-primary rounded-lg bg-brand-background text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.category_name}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-brand-background text-brand-primary
          border border-brand-primary hover:bg-white py-2 px-4 rounded-lg focus:outline-none
          focus:shadow-outline focus:shadow-outline"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="bg-brand-secondary text-white py-2 px-4 rounded-lg hover:bg-brand-accent"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMealModal;
