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
        fadeUp: {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(-8px)" },
        },
      },
      animation: {
        spin: "spin 2s linear infinite",
        scaleUp: "scaleUp 0.2s forwards",
        pulsate: "pulsate 1.2s ease-out infinite",
        shrink: "shrink 0.2s ease-in-out",
        fadeUp: "fadeUp 2s ease-out forwards",
      },
      colors: {
        neonGreenLight: "#3BEE22",
        neonGreenDark: "#39FF14",
        darkGreen: "#006400",
      },
      spacing: {
        "1/2.5": "40%", // HighScore difference
      },
    },
    fontFamily: {
      handwriting: ["Schoolbell", "cursive"],
    },
    letterSpacing: {
      tighter: "-0.10em",
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
