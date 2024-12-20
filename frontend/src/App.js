// frontend/src/App.js
// React と React Router からの必要なモジュールをインポート
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./shared/ErrorBoundary"; // 作成したエラーバウンダリをインポート

// アプリケーションの各ページコンポーネントをインポート
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompletePage from "./pages/CompletePage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";

// 認証済みかどうかをチェックする関数
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // トークンが存在するか確認
  return token ? children : <Navigate to="/login" replace />;
};

// メインのAppコンポーネントを定義
function App() {
  return (
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
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Appコンポーネントをデフォルトエクスポート
export default App;
