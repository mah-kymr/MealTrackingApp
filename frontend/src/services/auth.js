const API_BASE_URL = "http://localhost:3000/api";

export const login = async (username, password) => {
  const response = await fetch(`http://localhost:3000/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("ログインに失敗しました");
  }
  return data();
};
