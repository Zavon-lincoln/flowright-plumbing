/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:  '#003566',
          gold:  '#FFC300',
          light: '#E9F1FA',
          blue:  '#0077B6',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Barlow', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
