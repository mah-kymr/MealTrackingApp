const API_BASE_URL = "http://localhost:3000/api";

export const login = async (username, password) => {
  try {
    const response = await fetch(`/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // レスポンスがOKでない場合、エラーを投げる
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // レスポンスをJSONとしてパース
    const data = await response.json();

    return data; // data.tokenなどを返す
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
