/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        dancingScript: ['Dancing Script', 'cursive'], // Add Nunito to the font family options
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
