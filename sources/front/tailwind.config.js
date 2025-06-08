// tailwind.config.cjs
module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}' // Assure-toi que ce chemin correspond à ton projet
  ],
  theme: {
    extend: {
      fontFamily: {
        jaro: ['Jaro', 'sans-serif'],
      },
      fontSize: {
        '4.5xl': '2.6rem',
      },
      screens: {
        "xs": '360px',         // nouveau breakpoint
        "h-lg": { raw: "(min-height: 760px)" },
        "h-sm": { raw: "(max-height: 500px)" },
      },
    },
  },
  plugins: [],
}
