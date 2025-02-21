// frontend/src/App.js
// React と React Router からの必要なモジュールをインポート
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MealProvider } from "./context/MealContext"; // MealProviderをインポート
import ErrorBoundary from "./shared/ErrorBoundary"; // 作成したエラーバウンダリをインポート

// アプリケーションの各ページコンポーネントをインポート
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompletePage from "./pages/CompletePage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import MealHistoryPage from "./pages/MealHistoryPage"; // 新しい履歴ページをインポート

// 認証済みかどうかをチェックする関数
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // トークンが存在するか確認
  return token ? children : <Navigate to="/login" replace />;
};

// メインのAppコンポーネントを定義
function App() {
  return (
    <MealProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/complete" element={<CompletePage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <MealHistoryPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </MealProvider>
  );
}

// Appコンポーネントをデフォルトエクスポート
export default App;
