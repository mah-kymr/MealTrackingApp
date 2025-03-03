import React, { useState } from "react";

// JST に変換する関数
const formatDateTimeLocal = (isoString) => {
  const date = new Date(isoString);
  date.setHours(date.getHours() + 9); // UTC → JST に変換
  return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm 形式
};

const EditMealModal = ({ record, categories, onClose, onUpdate }) => {
  const [startTime, setStartTime] = useState(
    formatDateTimeLocal(record.start_time)
  );
  const [endTime, setEndTime] = useState(formatDateTimeLocal(record.end_time));
  const [categoryId, setCategoryId] = useState(record.category_id);

  const handleSubmit = async () => {
    // 送信時には JST から UTC に戻す
    const startUTC = new Date(startTime);
    startUTC.setHours(startUTC.getHours() - 9); // JST → UTC に戻す

    const endUTC = new Date(endTime);
    endUTC.setHours(endUTC.getHours() - 9); // JST → UTC に戻す

    await onUpdate(record.record_id, {
      start_time: startUTC.toISOString(),
      end_time: endUTC.toISOString(),
      category_id: categoryId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">記録の編集</h2>

        <label>開始時間:</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <label>終了時間:</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <label>食事カテゴリ:</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.category_name}
            </option>
          ))}
        </select>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white p-2 rounded"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMealModal;
