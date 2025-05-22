/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: ["./index.html", "./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
}

