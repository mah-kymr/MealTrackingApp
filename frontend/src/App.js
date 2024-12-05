// React と React Router からの必要なモジュールをインポート
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

// アプリケーションの各ページコンポーネントをインポート
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompletePage from "./pages/CompletePage";
import DashboardPage from "./pages/DashboardPage";

// 認証済みかどうかをチェックする関数
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // トークンが存在するか確認
  return token ? children : <Navigate to="/login" replace />;
};

// メインのAppコンポーネントを定義
function App() {
  return (
    // ルーティング機能を有効にするためのRouterコンポーネント
    <Router>
      {/* アプリケーションのルート定義を管理するRoutesコンポーネント */}
      <Routes>
        {/* "/dashboardPage"にアクセスした際にDashboardPageを表示 */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/complete" element={<CompletePage />} />
        <Route
          path="/DashboardPage"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        {/* デフォルトルート */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

// Appコンポーネントをデフォルトエクスポート
export default App;
