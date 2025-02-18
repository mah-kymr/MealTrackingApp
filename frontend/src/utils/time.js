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
export const formatTime = (isoString) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(isoString).toLocaleTimeString("ja-JP", options);
};

export const formatToLocalTime = (isoString) => {
  if (!isoString) return "不明";

// UTC形式をそのまま表示（変換を一時停止）
return isoString;
};
export const formatToLocalDate = (isoString) => {
  const options = {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Date(isoString).toLocaleDateString("ja-JP", options);
};
