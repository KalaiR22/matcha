/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        timmy: ["var(--font-family-body)", "Helvetica", "sans-serif"],
      },
      screens: {
        sm: "450px",
      },
      colors: {
        activeHead: "#17171c",
        inactiveHead: "#9299a6",
        sell: "#31353c",
        selectTokenbg: "#5932f3",
        borderLine: "#f1f2f4",
        borderDefault: "rgba(56, 56, 82, 0.05)",
      },
      keyframes: {
        spinCustom: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        spinCustom: "spinCustom 0.7s linear infinite",
      },
      
    },
  },
  plugins: [],
};

