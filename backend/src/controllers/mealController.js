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

    // JST で時刻を統一（変換の二重適用を防ぐ）
    const startTimeJST = new Date(start_time);
    const endTimeJST = new Date(end_time);

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
      const intervalMs = startTimeJST - previousEndTime; // getTime() を使わずに直接計算
      intervalMinutes = Math.max(1, Math.round(intervalMs / 60000)); // 切り捨てから四捨五入に変更・最低でも1分にする
    }

    // duration_minutes を計算
    const durationMs = endTimeJST.getTime() - startTimeJST.getTime();
    const durationMinutes = Math.ceil(durationMs / 60000);

    console.log(
      "Previous meal end time (JST):",
      previousMeal.rows[0]?.end_time || "None"
    );
    console.log("Current meal start time (JST):", startTimeJST);
    console.log("Calculated interval_minutes:", intervalMinutes);

    console.log("Final duration_minutes (formatted):", durationMinutes);
    console.log("Final interval_minutes (formatted):", intervalMinutes);

    // データベースに保存
    const result = await pool.query(
      `INSERT INTO meal_records (user_id, start_time, end_time, duration_minutes, interval_minutes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        req.user.user_id,
        startTimeJST,
        endTimeJST,
        durationMinutes,
        intervalMinutes !== null ? Math.floor(intervalMinutes) : 0,
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
        start_time: record.start_time,
        end_time: record.end_time,
        duration_minutes:
          record.duration_minutes !== null ? record.duration_minutes : 0,
        interval_minutes:
          record.interval_minutes !== null ? record.interval_minutes : 0,
        created_at: new Date(record.created_at).toLocaleString("ja-JP", {
          timeZone: "Asia/Tokyo",
        }),
      },
    });

    console.log("Response sent to client:", {
      status: "success",
      data: {
        ...record,
        start_time: record.start_time,
        end_time: record.end_time,
      },
    });
  } catch (err) {
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
