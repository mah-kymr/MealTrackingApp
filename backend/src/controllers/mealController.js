const pool = require("../config/db");
const schemas = require("../validation/schemas");
const updateMealIntervals = require("../services/updateMealIntervals");

const recordMeal = async (req, res) => {
  const { start_time, end_time, category_id } = req.body;

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
      category_id,
    });

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

    console.log(
      "Previous meal end time (UTC):",
      previousMeal.rows[0]?.end_time || "None"
    );
    console.log("Current meal start time (UTC):", startTimeUTC);
    console.log("Calculated interval_minutes:", intervalMinutes);
    console.log("Final duration_minutes:", durationMinutes);

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
    console.log("Database record:", record);

    res.status(201).json({
      status: "success",
      data: {
        record_id: record.record_id,
        user_id: record.user_id,
        category_id: record.category_id,
        start_time: record.start_time
          ? new Date(record.start_time).toISOString()
          : null,
        end_time: record.end_time
          ? new Date(record.end_time).toISOString()
          : null,
        duration_minutes: record.duration_minutes ?? 0,
        interval_minutes: record.interval_minutes ?? 0,
        created_at: record.created_at
          ? new Date(record.created_at).toISOString()
          : null,
      },
    });

    console.log("Response sent to client:", {
      status: "success",
      data: {
        ...record,
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

const getMealHistory = async (req, res) => {
  try {
    const { filterType } = req.query;
    let query = `
      SELECT 
        m1.record_id, 
        m1.user_id, 
        m1.category_id, 
        m1.start_time, 
        m1.end_time, 
        FLOOR(EXTRACT(EPOCH FROM (m1.end_time - m1.start_time)) / 60) AS duration_minutes,
        m1.created_at,
        COALESCE(
          FLOOR(EXTRACT(EPOCH FROM (m1.start_time - (
            SELECT m2.end_time FROM meal_records m2
            WHERE m2.user_id = m1.user_id 
            AND m2.start_time < m1.start_time
            ORDER BY m2.start_time DESC
            LIMIT 1
          ))) / 60), NULL
        ) AS interval_minutes
      FROM meal_records m1
      WHERE m1.user_id = $1
    `;

    if (filterType === "daily") {
      query += " AND m1.start_time >= CURRENT_DATE";
    } else if (filterType === "weekly") {
      query += " AND m1.start_time >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (filterType === "monthly") {
      query += " AND m1.start_time >= CURRENT_DATE - INTERVAL '30 days'";
    }

    query += " ORDER BY m1.start_time DESC";

    const { rows } = await pool.query(query, [req.user.user_id]);
    console.log("📌 API `/history` のレスポンス:", rows);

    res.json({ status: "success", data: rows });
  } catch (error) {
    console.error("❌ Error fetching meal history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 食事カテゴリを取得
const getMealCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Meal_Categories ORDER BY category_id"
    );

    res.status(200).json({ status: "success", data: result.rows });
  } catch (error) {
    console.error("Error fetching meal categories:", error);

    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const updateMealRecord = async (req, res) => {
  const { record_id } = req.params;
  const { start_time, end_time, category_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE meal_records 
       SET start_time = $1, end_time = $2, category_id = $3
       WHERE record_id = $4 AND user_id = $5 
       AND start_time >= NOW() - INTERVAL '30 days'
       RETURNING *`,
      [start_time, end_time, category_id, record_id, req.user.user_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "記録が見つかりません" });
    }

    // バッチ更新を実行
    await updateMealIntervals(req.user.user_id);

    res.status(200).json({ status: "success", data: result.rows[0] });
  } catch (error) {
    console.error("❌ Error updating meal record:", error);
    res
      .status(500)
      .json({ status: "error", message: "サーバーエラーが発生しました" });
  }
};

const deleteMealRecord = async (req, res) => {
  const { record_id } = req.params;

  try {
    // 🔵 削除対象の記録を取得
    const { rows } = await pool.query(
      "SELECT user_id, start_time FROM meal_records WHERE record_id = $1",
      [record_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    const { user_id, start_time } = rows[0];

    // 🔵 記録を削除
    await pool.query("DELETE FROM meal_records WHERE record_id = $1", [
      record_id,
    ]);

    // 🔵 削除後、前後の記録の `interval_minutes` を再計算
    await pool.query(
      `
      WITH prev AS (
        SELECT record_id, end_time FROM meal_records 
        WHERE user_id = $1 AND start_time < $2 
        ORDER BY start_time DESC LIMIT 1
      ),
      next AS (
        SELECT record_id, start_time FROM meal_records 
        WHERE user_id = $1 AND start_time > $2 
        ORDER BY start_time ASC LIMIT 1
      )
      UPDATE meal_records m
      SET interval_minutes = COALESCE(
        EXTRACT(EPOCH FROM (m.start_time - prev.end_time)) / 60, 
        EXTRACT(EPOCH FROM (next.start_time - m.end_time)) / 60
      )
      FROM prev, next
      WHERE m.record_id IN (prev.record_id, next.record_id)
    `,
      [user_id, start_time]
    );

    res.json({
      status: "success",
      message: "Meal record deleted and intervals updated",
    });
  } catch (error) {
    console.error("❌ Error deleting meal record:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  recordMeal,
  getMealHistory,
  getMealCategories,
  updateMealRecord,
  deleteMealRecord,
};
