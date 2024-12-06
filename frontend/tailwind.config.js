/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#42151f", // プライマリカラー
        "brand-secondary": "#833143", // セカンダリカラー
        "brand-accent": "#c85b7d", // アクセントカラー
        "brand-background": "#fbf4f7", // 背景色
      },
    },
  },
  plugins: [],
};
