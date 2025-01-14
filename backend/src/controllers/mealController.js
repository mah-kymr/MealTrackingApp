const pool = require("../config/db");
const schemas = require("../validation/schemas");

const recordMeal = async (req, res) => {
  const { start_time, end_time } = req.body;

  // バリデーションを実行
  const { error } = schemas.mealRecord.validate(req.body);
  if (error) {
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

    // データベースに挿入してduration_minutesを計算
    const result = await pool.query(
      `INSERT INTO meal_records (user_id, start_time, end_time, duration_minutes, interval_minutes)
      VALUES ($1, $2, $3, $3::timestamp - $2::timestamp, $4) RETURNING *`,
      [req.user.user_id, start_time, end_time, intervalMinutes]
    );

    const record = result.rows[0];
    console.log("Database record:", record);

    // duration_minutes 安全にフォーマット
    const totalSeconds = record.duration_minutes?.seconds || 0;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // フォーマット済みの時間を生成
    const formattedDuration =
      hours > 0 ? `${hours}時間 ${minutes}分` : `${minutes}分`;

    console.log("Formatted duration:", formattedDuration);

    res.status(201).json({
      status: "success",
      data: {
        ...record,
        formatted_duration: formattedDuration, // フォーマット済みの時間
        interval_minutes: intervalMinutes, // 食事間隔
      },
    });
  } catch (err) {
    // データベースエラーのハンドリング
    if (err.code === "23514") {
      // PostgreSQLの制約違反（check constraint）
      return res.status(400).json({
        status: "error",
        message: "データの整合性に違反しています。入力値を確認してください。",
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
