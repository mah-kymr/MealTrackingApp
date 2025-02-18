// JSTのタイムスタンプを生成する
export function getJstTimestamp(date = new Date()) {
  const offset = 9 * 60; // JSTはUTC+9
  const jstDate = new Date(date.getTime() + offset * 60000);
  return jstDate.toISOString().slice(0, 19).replace("T", " ");
}

// ISO文字列（UTC形式）をJSTの時間に変換
export const formatToLocalTime = (isoString) => {
  if (!isoString) return "不明";

  // UTC形式を基準に解析
  const utcDate = new Date(isoString);

  // JSTに変換
  const jstTime = utcDate.getTime() + 9 * 60 * 60 * 1000;
  const jstDate = new Date(jstTime);

  // JSTの時間をフォーマット
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return jstDate.toLocaleTimeString("ja-JP", options);
};
