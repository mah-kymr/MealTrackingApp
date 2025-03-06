// meal.js - 食事関連のAPI呼び出しを管理

// **食事履歴を取得**
export const fetchMealHistory = async (filterType = "daily") => {
  try {
    // APIリクエスト
    const response = await fetch(
      `/api/v1/meal/history?filterType=${filterType}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const result = await response.json();
    console.log("📌 API Response:", result.data); // 🔍 デバッグログ

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch meal history");
    }

    // **データの整形**
    return result.data.map((record) => ({
      record_id: record.record_id,
      category_id: record.category_id,
      start_time: record.start_time
        ? new Date(record.start_time).toISOString()
        : null,
      end_time: record.end_time
        ? new Date(record.end_time).toISOString()
        : null,
      duration: record.duration ?? 0, // ✅ `duration` を適切に取得
      interval: record.interval ?? 0, // ✅ `interval` を適切に取得
    }));
  } catch (error) {
    console.error("❌ Error fetching meal history:", error);
    return [];
  }
};

// **食事カテゴリを取得**
export const fetchMealCategories = async () => {
  try {
    // **APIリクエスト**
    await new Promise((resolve) => setTimeout(resolve, 100)); // 遅延を加えて `localStorage` を確実に取得

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn(
        "⚠️ トークンが取得できませんでした。ログインを確認してください。"
      );
      return [];
    }

    const response = await fetch("/api/v1/meal/categories", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      console.warn(
        "⚠️ 401 Unauthorized: トークンが無効か、ログインが必要です。"
      );
      return [];
    }

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to fetch categories");

    console.log("✅ カテゴリ取得成功:", result.data);
    return result.data;
  } catch (error) {
    console.error("❌ Error fetching meal categories:", error);
    return [];
  }
};

// **食事記録を追加**
export const addMealRecord = async (start_time, end_time, category_id) => {
  try {
    console.log("📌 Request Body:", { start_time, end_time, category_id }); // 🔍 デバッグログ

    const response = await fetch("/api/v1/meal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        start_time,
        end_time,
        category_id,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Server Error:", result);
      throw new Error(result.message || "記録に失敗しました");
    }

    console.log("✅ 記録保存成功:", result.data);
    return result.data;
  } catch (error) {
    console.error("❌ Error saving meal record:", error);
    throw error;
  }
};

// **食事記録を更新**
export const updateMealRecord = async (record_id, updatedData) => {
  try {
    console.log("📌 Updating meal record:", updatedData); // 🔍 デバッグログ

    const response = await fetch(`/api/v1/meal/${record_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to update record");

    console.log("✅ 記録更新成功:", result.data);
    return result.data;
  } catch (error) {
    console.error("❌ Error updating meal record:", error);
    throw error;
  }
};

// **食事記録を削除**
export const deleteMealRecord = async (record_id) => {
  try {
    console.log("🗑️ Deleting record:", record_id); // 🔍 デバッグログ

    const response = await fetch(`/api/v1/meal/${record_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete record");
    }

    console.log("✅ 記録削除成功:", record_id);
    return true;
  } catch (error) {
    console.error("❌ Error deleting meal record:", error);
    return false;
  }
};
