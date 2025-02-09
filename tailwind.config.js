/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text|border|from|to|hover:bg|hover:text|hover:border)-(purple|pink|blue|teal|rose|orange|emerald|sky)-(50|100|200|300|400|500|600|700)/,
    },
  ],
};