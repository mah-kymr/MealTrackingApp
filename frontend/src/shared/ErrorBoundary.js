import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // 子コンポーネントでエラーが発生した場合に state を更新
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // エラー情報をログに記録（オプション）
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // エラーが発生した場合のフォールバック UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    // エラーが発生していない場合は通常の子コンポーネントをレンダリング
    return this.props.children;
  }
}

export default ErrorBoundary;
