/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B", // Vivid Coral
        secondary: "#4ECDC4", // Fresh Mint
        midnight: "#1A535C", // Midnight Blue
        slate: "#2D3436", // Dark Slate
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
