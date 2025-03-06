const pool = require("../config/db");

const updateMealIntervals = async (userId) => {
  try {
    await pool.query(
      `WITH sorted_records AS (
          SELECT record_id, start_time, 
                 LAG(end_time) OVER (PARTITION BY user_id ORDER BY start_time) AS previous_end
          FROM meal_records
          WHERE user_id = $1 AND start_time >= NOW() - INTERVAL '30 days'
      )
      UPDATE meal_records AS m
      SET interval_minutes = 
          CASE 
            WHEN s.previous_end IS NULL THEN NULL 
            ELSE CAST(GREATEST(0, FLOOR(ABS(EXTRACT(EPOCH FROM (s.start_time - s.previous_end)) / 60))) AS INTEGER)
          END
      FROM sorted_records AS s
      WHERE m.record_id = s.record_id;`,
      [userId]
    );
    console.log(`✅ バッチ更新完了 (User ID: ${userId})`);
  } catch (error) {
    console.error("❌ SQLエラー: ", error.message);
  }
};

module.exports = updateMealIntervals;
