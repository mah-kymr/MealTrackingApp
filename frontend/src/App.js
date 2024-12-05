// React と React Router からの必要なモジュールをインポート
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// アプリケーションの各ページコンポーネントをインポート
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompletePage from "./pages/CompletePage";
import DashboardPage from "./pages/DashboardPage";

// メインのAppコンポーネントを定義
const App = () => {
  return (
    // ルーティング機能を有効にするためのRouterコンポーネント
    <Router>
      {/* アプリケーションのルート定義を管理するRoutesコンポーネント */}
      <Routes>
        {/* ルートパス("/")にアクセスした際にLoginPageを表示 */}
        <Route path="/" element={<LoginPage />} />

        {/* "/dashboardPage"にアクセスした際にDashboardPageを表示 */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/complete" element={<CompletePage />} />
        <Route path="/DashboardPage" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

// Appコンポーネントをデフォルトエクスポート
export default App;
