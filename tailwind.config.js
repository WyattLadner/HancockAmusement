/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Palette sampled from the official Hancock Amusement logo (see reference-demo
      // README). Ported verbatim from the approved demo — do not re-hex without sign-off.
      colors: {
        ink: "#050C15",
        surface: "#0A1422",
        "surface-2": "#0F1D2E",
        line: "#1C2E45",
        red: "#F60B1A",
        blue: "#3188F2",
        chalk: "#F3F5F7",
        smoke: "#919DAC",
      },
      fontFamily: {
        // Values are CSS variables wired up by next/font in app/layout.js
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-barlow)", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
