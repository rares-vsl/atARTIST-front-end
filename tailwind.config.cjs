/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'kalam': ['Kalam', 'Roboto', 'sans-serif']
      },
    }
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}
