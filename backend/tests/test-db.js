const pool = require("../config/db");
const schemas = require("../validation/schemas");

const recordMeal = async (req, res) => {
  const { start_time, end_time, category_id } = req.body;

  // バリデーションを実行
  const { error } = schemas.mealRecord.validate(req.body);
  if (error) {
    console.error("Validation Error Details:", error.details);
    return res.status(400).json({
      status: "error",
      errors: error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      })),
    });
  }

  try {
    console.log("🔍 受け取ったデータ:", { start_time, end_time, category_id });

    // 🔥 修正: `category_id` が Meal_Categories に存在するか確認
    const categoryCheck = await pool.query(
      `SELECT category_id FROM Meal_Categories WHERE category_id = $1`,
      [category_id]
    );

    if (categoryCheck.rows.length === 0) {
      console.error("Invalid category_id:", category_id);
      return res.status(400).json({
        status: "error",
        message: "無効なカテゴリIDです。",
      });
    }

    const startTimeUTC = start_time; // そのままDBに保存
    const endTimeUTC = end_time;

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
      const intervalMs = new Date(startTimeUTC) - previousEndTime;
      intervalMinutes = Math.max(1, Math.round(intervalMs / 60000));
    }

    // duration_minutes を計算
    const durationMs = new Date(endTimeUTC) - new Date(startTimeUTC);
    const durationMinutes = Math.ceil(durationMs / 60000);

    console.log("⏳ 計算結果: ", { intervalMinutes, durationMinutes });

    // データベースに保存
    const result = await pool.query(
      `INSERT INTO meal_records (user_id, category_id, start_time, end_time, duration_minutes, interval_minutes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        req.user.user_id,
        category_id,
        startTimeUTC,
        endTimeUTC,
        durationMinutes,
        intervalMinutes !== null ? Math.floor(intervalMinutes) : 0,
      ]
    );

    const record = result.rows[0];
    console.log("📄 DBに保存されたデータ:", record);

    res.status(201).json({
      status: "success",
      data: record, // 🔥 修正: そのまま返す
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({
      status: "error",
      message: "サーバーエラーが発生しました。管理者にお問い合わせください。",
    });
  }
};

const updateMealRecord = async (req, res) => {
  const { record_id } = req.params;
  const { start_time, end_time, category_id } = req.body;

  try {
    console.log("✏️ 更新リクエスト:", { start_time, end_time, category_id });

    // 直前の記録を取得して食事間隔を再計算
    const previousMeal = await pool.query(
      `SELECT end_time FROM meal_records 
       WHERE user_id = $1 AND record_id != $2
       ORDER BY end_time DESC LIMIT 1`,
      [req.user.user_id, record_id]
    );

    let intervalMinutes = null;
    if (previousMeal.rows.length > 0) {
      const previousEndTime = new Date(previousMeal.rows[0].end_time);
      const intervalMs = new Date(start_time) - previousEndTime;
      intervalMinutes = Math.max(1, Math.round(intervalMs / 60000));
    }

    const durationMs = new Date(end_time) - new Date(start_time);
    const durationMinutes = Math.ceil(durationMs / 60000);

    console.log("⏳ 更新後の計算結果: ", { intervalMinutes, durationMinutes });

    const result = await pool.query(
      `UPDATE meal_records 
       SET start_time = $1, end_time = $2, category_id = $3, 
           duration_minutes = $4, interval_minutes = $5 
       WHERE record_id = $6 AND user_id = $7 
       RETURNING *`,
      [
        start_time,
        end_time,
        category_id,
        durationMinutes,
        intervalMinutes,
        record_id,
        req.user.user_id,
      ]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "記録が見つかりません" });
    }

    console.log("✅ 更新後のデータ:", result.rows[0]);

    res.status(200).json({ status: "success", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating meal record:", error);
    res
      .status(500)
      .json({ status: "error", message: "サーバーエラーが発生しました" });
  }
};

const getMealHistory = async (req, res) => {
  const userId = req.user.user_id;
  const { filterType } = req.query; // "daily", "weekly", "monthly"

  let query = `SELECT * FROM meal_records WHERE user_id = $1`;
  let params = [userId];

  if (filterType === "daily") {
    query += ` AND start_time >= NOW() - INTERVAL '1 day'`;
  } else if (filterType === "weekly") {
    query += ` AND start_time >= NOW() - INTERVAL '7 days'`;
  } else if (filterType === "monthly") {
    query += ` AND start_time >= NOW() - INTERVAL '1 month'`;
  }

  query += ` ORDER BY start_time DESC`;

  try {
    const result = await pool.query(query, params);
    console.log("📜 取得した履歴:", result.rows);
    res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      status: "error",
      message: "サーバーエラーが発生しました。",
    });
  }
};

module.exports = {
  recordMeal,
  getMealHistory,
  updateMealRecord,
};
