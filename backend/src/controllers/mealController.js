const pool = require("../config/db");
const schemas = require("../validation/schemas");

const recordMeal = async (req, res) => {
  const { start_time, end_time } = req.body;

  // バリデーションを実行
  const { error } = schemas.mealRecord.validate(req.body);
  if (error) {
    console.error("Validation Error Details:", error.details); // バリデーションエラー詳細をログ
    return res.status(400).json({
      status: "error",
      errors: error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      })),
    });
  }

  try {
    console.log("Preparing to insert into database:", {
      user_id: req.user.user_id,
      start_time,
      end_time,
    });

    // 直前の記録を取得して間隔を計算
    const previousMeal = await pool.query(
      `SELECT end_time FROM meal_records 
       WHERE user_id = $1 
       ORDER BY end_time DESC LIMIT 1`,
      [req.user.user_id]
    );

    let intervalMinutes = null;
    if (previousMeal.rows.length > 0) {
      const previousEndTime = new Date(previousMeal.rows[0].end_time);
      const currentStartTime = new Date(start_time);
      const intervalMs = currentStartTime - previousEndTime;
      intervalMinutes = Math.max(0, Math.floor(intervalMs / 60000));
    }

    // duration_minutes を計算（修正）
    const durationMs = new Date(end_time) - new Date(start_time);
    const durationMinutes = Math.ceil(durationMs / 60000); // ⬅ 切り上げ処理で修正

    console.log(
      "Previous meal end time:",
      previousMeal.rows[0]?.end_time || "None"
    );
    console.log("Current meal start time:", start_time);
    console.log("Calculated interval_minutes:", intervalMinutes);

    // 'INTERVAL' 型に変換
    const durationValue = `${Math.max(1, durationMinutes)} minutes`; // 最小値を1分に設定
    const intervalValue =
      intervalMinutes !== null
        ? `${Math.max(0, Math.floor(intervalMinutes))} minutes`
        : "0 minutes";

    console.log("Final duration_minutes (formatted):", durationValue);
    console.log("Final interval_minutes (formatted):", intervalValue);

    // 修正:PostgreSQL の EXTRACT を使用して、duration_minutes を整数で取得
    const result = await pool.query(
      `INSERT INTO meal_records (user_id, start_time, end_time, duration_minutes, interval_minutes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        req.user.user_id,
        start_time,
        end_time,
        durationMinutes, // ⬅ ここで適切な durationMinutes を渡す
        intervalMinutes !== null ? Math.floor(intervalMinutes) : 0, // ここで数値に変換
      ]
    );

    const record = result.rows[0];
    console.log("Database record:", record);

    res.status(201).json({
      status: "success",
      data: {
        record_id: record.record_id,
        user_id: record.user_id,
        category_id: record.category_id,
        start_time: new Date(record.start_time).toISOString(),
        end_time: new Date(record.end_time).toISOString(),
        duration_minutes:
          record.duration_minutes !== null ? record.duration_minutes : 0, // 🚀 そのまま数値として返す
        interval_minutes:
          record.interval_minutes !== null ? record.interval_minutes : 0, // 🚀 そのまま数値として返す
        created_at: new Date(record.created_at).toISOString(),
      },
    });

    // デバッグログを追加（レスポンス内容を記録）
    console.log("Response sent to client:", {
      status: "success",
      data: {
        ...record,
        start_time: new Date(record.start_time).toISOString(), // 明示的にUTC形式
        end_time: new Date(record.end_time).toISOString(),
      },
    });
  } catch (err) {
    // データベースエラーのハンドリング
    if (err.code === "23514") {
      // PostgreSQLの制約違反（check constraint）
      console.error("Database Constraint Error:", err); // 制約エラー詳細をログ
      return res.status(400).json({
        status: "error",
        message:
          "データの整合性に違反しています。開始時刻と終了時刻が正しいか確認してください。",
      });
    }

    // その他のエラー
    console.error("Database Error:", err);
    res.status(500).json({
      status: "error",
      message: "サーバーエラーが発生しました。管理者にお問い合わせください。",
    });
  }
};

module.exports = {
  recordMeal,
};
