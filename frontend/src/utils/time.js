// JSTのタイムスタンプを生成する
export function getJstTimestamp(date = new Date()) {
  const offset = 9 * 60; // JSTはUTC+9
  const jstDate = new Date(date.getTime() + offset * 60000);
  return jstDate.toISOString().slice(0, 19).replace("T", " ");
}
