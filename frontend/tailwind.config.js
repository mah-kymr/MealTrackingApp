/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // プライマリカラー
        "brand-primary": "#42151f",

        // セカンダリカラー
        "brand-secondary": "#833143",

        // アクセントカラー
        "brand-accent": "#c85b7d",

        // 背景色
        "brand-background": "#fbf4f7",
      },
    },
  },
  plugins: [],
};
