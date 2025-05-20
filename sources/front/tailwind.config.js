const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '360px',
      ...defaultTheme.screens, // remplace les écrans par défaut
    },
    extend: {
      fontFamily: {
        jaro: ['Jaro', 'sans-serif'],
      },
      fontSize: {
        '4.5xl': '2.6rem',
      },
    },
  },
  plugins: [],
};
