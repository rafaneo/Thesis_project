/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./**/*.{html,js}'],
	theme: {
		extend: {
		  gridTemplateRows: {
			'[auto,auto,1fr]': 'auto auto 1fr',
		  },
		},
	  },
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		// require('@tailwindcss/forms')
],
};