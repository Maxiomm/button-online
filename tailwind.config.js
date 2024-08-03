/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.1)" },
        },
        pulsate: {
          "0%": { transform: "scale(0.1)", opacity: "0.0" },
          "50%": { opacity: "1.0" },
          "100%": { transform: "scale(0.9)", opacity: "0.0" },
        },
        shrink: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.9)" },
        },
      },
      animation: {
        spin: "spin 2s linear infinite",
        scaleUp: "scaleUp 0.2s forwards",
        pulsate: "pulsate 1.2s ease-out infinite",
        shrink: "shrink 0.2s ease-in-out",
      },
      colors: {
        neonGreenLight: "#3BEE22",
        neonGreenDark: "#39FF14",
        darkGreen: "#006400",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
