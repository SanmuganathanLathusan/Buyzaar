/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0084D6', // Minago Blue
          hover: '#006BBD',
          light: '#E6F3FA',
        },
        secondary: '#333333',
        background: {
          DEFAULT: '#F5F5F5',
          dark: '#121212',
          card: '#FFFFFF',
          cardDark: '#1E1E1E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
