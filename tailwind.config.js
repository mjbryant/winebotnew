/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{html,js,ts,tsx}',
    './src/components/**/*.{html,js,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'blue': {
          // '200': '#b0c4de',
          '500': '#add8e6',
          '700': '#1e3a8a',
          // you can add more shades here
        },
        // you can add more colors here
      },
    },
  },
  plugins: [],
}

