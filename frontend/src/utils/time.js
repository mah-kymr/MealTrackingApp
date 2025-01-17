// JSTのタイムスタンプを生成する
export function getJstTimestamp(date = new Date()) {
  const offset = 9 * 60; // JSTはUTC+9
  const jstDate = new Date(date.getTime() + offset * 60000);
  return jstDate.toISOString().slice(0, 19).replace("T", " ");
}

// 日付を「yyyy-mm-dd」形式でフォーマット
export function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10); // 年月日
}

// 時間フォーマットを一元化
export const formatTime = (dateString) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleTimeString("ja-JP", options);
};