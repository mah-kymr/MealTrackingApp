import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// ダミーデータ: 1週間分の食事時間データ
const data = [
  { date: "03/05", breakfast: [7, 8], lunch: [12, 13], dinner: [19, 20] },
  { date: "03/06", breakfast: [7, 9], lunch: [12, 13], dinner: [18, 20] },
  { date: "03/07", breakfast: [8, 9], lunch: [13, 14], dinner: [19, 21] },
  { date: "03/08", breakfast: [], lunch: [12, 13], dinner: [18, 19] }, // 朝食なし
  { date: "03/09", breakfast: [6, 7], lunch: [12, 13], dinner: [18, 20] },
];

// Recharts 用のデータ変換関数
const processData = (data) => {
  return data.map((day) => ({
    date: day.date,
    breakfastStart: day.breakfast.length ? day.breakfast[0] : null,
    breakfastEnd: day.breakfast.length ? day.breakfast[1] : null,
    lunchStart: day.lunch.length ? day.lunch[0] : null,
    lunchEnd: day.lunch.length ? day.lunch[1] : null,
    dinnerStart: day.dinner.length ? day.dinner[0] : null,
    dinnerEnd: day.dinner.length ? day.dinner[1] : null,
  }));
};

const MealTimelineChart = () => {
  const chartData = processData(data);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        layout="horizontal"
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/* X軸（時間） */}
        <XAxis
          type="number"
          domain={[0, 24]} // 24時間表示
          tickFormatter={(hour) => `${hour}:00`}
        />
        {/* Y軸（日付） */}
        <YAxis dataKey="date" type="category" />
        <Tooltip />
        {/* 各食事の時間をバーで描画 */}
        <Bar
          dataKey="breakfastStart"
          stackId="meal"
          fill="#FFA07A"
          barSize={10}
        />
        <Bar dataKey="lunchStart" stackId="meal" fill="#FFD700" barSize={10} />
        <Bar dataKey="dinnerStart" stackId="meal" fill="#20B2AA" barSize={10} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MealTimelineChart;
