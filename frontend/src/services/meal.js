// meal.js - 食事関連のAPI呼び出しを管理

export const fetchMealCategories = async () => {
  try {
    const response = await fetch("/api/v1/meal/categories", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch categories");
    }

    return result.data; // カテゴリ一覧を返す
  } catch (error) {
    console.error("Error fetching meal categories:", error);
    return [];
  }
};
