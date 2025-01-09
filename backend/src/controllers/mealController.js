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

    // duration_minutes をデータベースで計算
    const result = await pool.query(
      `INSERT INTO meal_records (user_id, start_time, end_time, duration_minutes)
      VALUES ($1, $2, $3, $3::timestamp - $2::timestamp) RETURNING *`,
      [req.user.user_id, start_time, end_time]
    );

    console.log("Insert result:", result.rows);
    res.status(201).json({
      status: "success",
      data: result.rows[0],
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
