/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ['./src/**/*.{tsx,jsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#f27024',
          hover: '#c0571e'
        }
      }
    }
  },
  plugins: [require('@headlessui/tailwindcss'), require('tailwind-scrollbar')]
}

module.exports = tailwindConfig
