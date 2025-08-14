const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  safelist: ["grid-cols-1", "grid-cols-2", "grid-cols-4"],
  theme: {
    screens: {
      ...defaultTheme.screens, // remplace les écrans par défaut
    },
    extend: {
      fontFamily: { jaro: ["Jaro", "sans-serif"] },
      fontSize: {},
    },
  },
  plugins: [],
};
