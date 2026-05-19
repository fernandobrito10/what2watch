import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#14181c",
        surface: "#1c2228",
        "surface-2": "#2a323c",
        accent: "#00e054",
        "accent-2": "#40bcf4",
        "accent-3": "#ff8000",
        muted: "#9ab",
        border: "#456",
      },
      fontFamily: {
        sans: ["TiemposText", "Georgia", "ui-serif", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
