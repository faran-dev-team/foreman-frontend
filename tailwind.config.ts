import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foreman: {
          navy: "#0f172a",
          slate: "#1e293b",
          accent: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
