const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
	theme: {
		screens: {
			...defaultTheme.screens,
		},
		extend: {
			fontFamily: {
				jaro: ["Jaro", "sans-serif"],
			},
			fontSize: {},
			colors: {
				...colors,
			},
		},
	},
	plugins: [],
};
