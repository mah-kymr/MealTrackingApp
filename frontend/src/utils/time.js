// JSTのタイムスタンプを生成する
export function getJstTimestamp(date = new Date()) {
  const offset = 9 * 60; // JSTはUTC+9
  const jstDate = new Date(date.getTime() + offset * 60000);
  return jstDate.toISOString().slice(0, 19).replace("T", " ");
}

// 時刻を「hh:mm」形式でフォーマット
export function formatTime(date) {
  const d = new Date(date);
  return d.toTimeString().slice(0, 5); // 時間と分のみ
}

// 日付を「yyyy-mm-dd」形式でフォーマット
export function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10); // 年月日
}
