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
      intervalMinutes = Math.floor(intervalMs / 60000); // ミリ秒を分に変換
    }
    // duration_minutes を計算
    const durationMs = new Date(end_time) - new Date(start_time);
    const durationMinutes = Math.max(1, Math.floor(durationMs / 60000)); // 最小値を1分に設定

    console.log("Calculated duration_minutes:", durationMinutes);
    console.log("Calculated interval_minutes:", intervalMinutes);

    // 'INTERVAL' 型に変換
    const durationValue = `${Math.max(1, durationMinutes)} minutes`; // 最小値を1分に設定
    const intervalValue =
      intervalMinutes !== null
        ? `${Math.max(0, Math.floor(intervalMinutes))} minutes`
        : "0 minutes";

    console.log("Final duration_minutes (formatted):", durationValue);
    console.log("Final interval_minutes (formatted):", intervalValue);

    // データベースに挿入してduration_minutesを計算
    const result = await pool.query(
      `INSERT INTO meal_records (user_id, start_time, end_time, duration_minutes, interval_minutes)
       VALUES ($1, $2, $3, $3::timestamp - $2::timestamp, $4::INTERVAL) RETURNING *`,
      [req.user.user_id, start_time, end_time, intervalValue]
    );

    const record = result.rows[0];
    console.log("Database record:", record);

    res.status(201).json({
      status: "success",
      data: {
        ...record,
        duration_minutes: durationMinutes, // 数値形式で返す
        interval_minutes: intervalMinutes, // 食事間隔
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
