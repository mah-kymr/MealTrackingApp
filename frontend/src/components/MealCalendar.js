import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useContext } from "react";
import { MealContext } from "../context/MealContext";

// ✅ `YYYY-MM-DD` 形式を手動で作成（「日」が入らない）
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // ✅ `YYYY-MM-DD` 形式で返す
};

const MealCalendar = ({ onSelectDate }) => {
  const { records } = useContext(MealContext);
  const [mealDates, setMealDates] = useState([]);

  useEffect(() => {
    if (records) {
      // ✅ 記録がある日付を `YYYY-MM-DD` 形式で取得
      const dates = records.map((record) =>
        formatDate(new Date(record.start_time))
      );
      setMealDates(dates);
    }
  }, [records]);

  return (
    <div className="flex justify-center items-center py-6">
      <div className="p-4 bg-white shadow-lg rounded-2xl">
        <h2 className="text-xl font-bold text-brand-primary mb-4 text-center">
          食事記録カレンダー
        </h2>
        <div className="p-3">
          <Calendar
            locale="ja-JP" // ✅ 日本語のままにする
            formatDay={(locale, date) => String(date.getDate())} // ✅ 「日」だけを消して、数字のみ表示
            onClickDay={(date) => {
              const jstDate = formatDate(date); // ✅ `YYYY-MM-DD` に統一
              console.log("📅 修正後のカレンダー選択日:", jstDate);
              onSelectDate(jstDate);
            }}
            tileClassName={({ date, view }) => {
              if (view === "month") {
                const formattedDate = formatDate(date); // ✅ `YYYY-MM-DD` に統一
                return mealDates.includes(formattedDate)
                  ? "react-calendar__tile--custom"
                  : "react-calendar__tile--default";
              }
            }}
          />
        </div>
      </div>{" "}
      <style>{`
        /* ✅ カレンダー全体のデザインを調整 */
        .react-calendar {
          font-family: 'Roboto Mono', monospace !important;
          border-radius: 16px !important; /* ✅ 枠を丸く */
          padding: 12px !important; /* ✅ 余白を増やす */
          background-color: #fbf4f7 !important; /* ✅ ブランドカラーの薄いピンク */
          border: none !important; /* ✅ 境界線（黒い細い線）を削除 */
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* ✅ ふんわり影を追加 */
        }
        /* ✅ 曜日の表示を中央にし、日付と揃える */
        .react-calendar__month-view__weekdays {
          width: 100% !important;
          display: flex !important;
          justify-content: space-between !important;
        }
        /* ✅ 曜日の文字色を brand-primary に統一 */
        .react-calendar__month-view__weekdays__weekday {
          text-align: center !important;
          width: 40px !important; /* ✅ 日付の幅と揃える */
          color: #42151f !important; /* ✅ brand-primary */
          font-weight: bold !important;
        }
        /* ✅ カレンダーのグリッドサイズを調整 */
        .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 6px !important; /* ✅ 余白を微調整 */
        }
        /* ✅ カレンダーの日付セルを正円にする */
        .react-calendar__tile {
          font-family: 'Roboto Mono', monospace !important;
          width: 40px !important; /* ✅ 正円にする */
          height: 40px !important; /* ✅ 正円にする */
          min-width: 40px !important; /* ✅ 曜日セルと揃える */
          min-height: 40px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 50% !important; /* ✅ 丸くする */
        }
        /* ✅ 記録がある日を強調（正円のまま背景色を適用） */
        .react-calendar__tile--custom {
          background-color: #c85b7d !important; /* ✅ brand-secondary */
          color: white !important;
          font-weight: bold;
        }
        /* ✅ 記録がある日のホバー時 */
        .react-calendar__tile--custom:hover {
          background-color: #833143 !important; /* ✅ brand-accent */
          color: white !important;
        }
        /* ✅ 記録がない日のデフォルト背景を白にし、文字色を brand-primary にする */
        .react-calendar__tile--default {
          background-color: #ffffff !important;
          color: #42151f !important; /* ✅ brand-primary */
        }
        /* ✅ 記録がない日のホバー時 */
        .react-calendar__tile--default:hover {
          background-color: #e5e7eb !important;
          color: black !important;
        }
        /* ✅ 選択した日（背景を丸くする） */
        .react-calendar__tile--active {
          background-color: #833143 !important; /* ✅ ピンク系 */
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default MealCalendar;
