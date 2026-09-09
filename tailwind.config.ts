import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f0fc",
          100: "#e4e0f9",
          200: "#c7bff2",
          300: "#a595e9",
          400: "#8067de",
          500: "#5f45d1",
          600: "#4b34b8",
          700: "#3f2b96",
          800: "#362678",
          900: "#2c1f5e",
        },
      },
      boxShadow: {
        widget: "0 20px 50px -12px rgba(43, 31, 94, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
