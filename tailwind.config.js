/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ['./src/**/*.{tsx,jsx}', './index.html'],
  theme: {
    extend: {}
  },
  plugins: [require('@headlessui/tailwindcss')]
}

module.exports = tailwindConfig
