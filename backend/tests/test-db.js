useEffect(() => {
  if (!token) {
    console.warn("⚠️ トークンがないためカテゴリ取得をスキップ");
    setIsLoadingCategories(false);
    return;
  }

  const fetchCategories = async () => {
    console.log("📌 Fetching meal categories...");
    try {
      setIsLoadingCategories(true);
      const categoryData = await fetchMealCategories();
      if (!categoryData || categoryData.length === 0) {
        throw new Error("カテゴリが取得できませんでした");
      }
      console.log("✅ Fetched categories:", categoryData);
      setCategories(categoryData);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      setCategories([]); // **エラー時は空配列**
    } finally {
      setIsLoadingCategories(false);
    }
  };

  fetchCategories();
}, [token]); // **トークンが変更されたときにカテゴリを再取得**
