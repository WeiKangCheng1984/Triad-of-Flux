import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 方案三：古典雅緻 + 水墨風格
        paper: {
          DEFAULT: "#f4f1e8",
          light: "#faf8f3",
        },
        ink: {
          DEFAULT: "#2c2c2c",
          dark: "#1a1a1a",
          medium: "#4a4a4a",
          light: "#8a8a8a",
        },
        // 類別色系
        sky: {
          start: "#4a5568",
          end: "#2d3748",
        },
        earth: {
          start: "#8b6f47",
          end: "#6b5233",
        },
        human: {
          start: "#c05621",
          end: "#9c4221",
        },
        variable: {
          start: "#553c9a",
          end: "#44337a",
        },
      },
      borderRadius: {
        card: "24px",
      },
    },
  },
  plugins: [],
};
export default config;

