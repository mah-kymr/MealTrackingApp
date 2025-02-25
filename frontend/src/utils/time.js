// JSTのタイムスタンプを生成する
export function getJstTimestamp(date = new Date()) {
  return new Date(date.getTime()).toISOString(); // UTC 形式で返す
}

// 日付を「yyyy-mm-dd」形式でフォーマット
export function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10); // UTCベース
}

export function formatToLocalDate(isoString) {
  if (!isoString) return "不明";

  const date = new Date(isoString); // UTC のまま解釈
  date.setUTCHours(date.getUTCHours() + 9); // +9時間して JST に変換

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export const formatTime = (isoString) => {
  if (!isoString) return "不明";

  const date = new Date(isoString); // UTC のまま解釈
  const jstHours = (date.getUTCHours() + 9) % 24; // +9時間し、24時間を超えたらリセット
  const jstMinutes = date.getUTCMinutes();

  return `${String(jstHours).padStart(2, "0")}:${String(jstMinutes).padStart(
    2,
    "0"
  )}`;
};

export const formatToLocalTime = (isoString) => {
  if (!isoString || isoString === "null") return "記録なし";

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) throw new Error("Invalid date");

    const jstHours = (date.getUTCHours() + 9) % 24;
    const jstMinutes = date.getUTCMinutes();

    return `${String(jstHours).padStart(2, "0")}:${String(jstMinutes).padStart(
      2,
      "0"
    )}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "記録なし";
  }
};
