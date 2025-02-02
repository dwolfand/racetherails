/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "metro-red": "#C8102E", // WMATA Red Line color
        rtr: {
          bronze: "#C5A572", // Logo background color
          dark: "#1A1A1A", // Logo dark elements
          cream: "#F5F0E6", // Logo light elements
          gold: "#B38B4D", // Logo accent color
        },
      },
      textShadow: {
        DEFAULT: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        lg: "4px 4px 8px rgba(0, 0, 0, 0.5)",
      },
      backgroundColor: {
        "bronze-gradient": "linear-gradient(to bottom right, #C5A572, #B38B4D)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow": {
          "text-shadow": "2px 2px 4px rgba(0, 0, 0, 0.5)",
        },
        ".text-shadow-lg": {
          "text-shadow": "4px 4px 8px rgba(0, 0, 0, 0.5)",
        },
      });
    },
  ],
};
