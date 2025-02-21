import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/v1/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "プロファイル取得に失敗しました"
          );
        }

        const data = await response.json();
        setUserData({
          userId: data.user.user_id,
          username: data.user.username,
        });
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  return { userData, isLoading, error };
};
