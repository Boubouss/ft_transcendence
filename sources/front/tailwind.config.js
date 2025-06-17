const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      ...defaultTheme.screens, // remplace les écrans par défaut
    },
    extend: {
      fontFamily: {
        jaro: ['Jaro', 'sans-serif'],
      },
      fontSize: {
      },
    },
  },
  plugins: [],
};
