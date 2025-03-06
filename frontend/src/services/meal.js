// meal.js - 食事関連のAPI呼び出しを管理

export const fetchMealCategories = async () => {
  try {
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
    console.error("Error fetching meal categories:", error);
    return [];
  }
};
