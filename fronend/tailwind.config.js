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
          DEFAULT: '#F85606', // Daraz Orange
          hover: '#E04A00',
          light: '#FFF0E6',
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
