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
          DEFAULT: '#0084D6',
          hover: '#006BBD',
          light: '#E6F3FA',
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        secondary: '#1e293b',
        accent: '#f97316',
        success: '#10b981',
        danger:  '#ef4444',
        warning: '#f59e0b',
        background: {
          DEFAULT: '#f8fafc',
          dark: '#0f172a',
          card: '#ffffff',
          cardDark: '#1e293b',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1e293b',
          muted: '#f1f5f9',
          mutedDark: '#334155',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        'card-lg': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'card-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'glow':    '0 0 20px -5px rgb(0 132 214 / 0.4)',
        'glow-lg': '0 0 40px -10px rgb(0 132 214 / 0.5)',
        'inner-sm':'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0084D6 0%, #00b4d8 100%)',
        'gradient-dark':    'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        'gradient-warm':    'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
        'gradient-surface': 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-out',
        'fade-up':      'fadeUp 0.4s ease-out',
        'slide-in-right':'slideInRight 0.3s ease-out',
        'bounce-soft':  'bounceSoft 2s infinite',
        'shimmer':      'shimmer 2s infinite linear',
        'pulse-glow':   'pulseGlow 2s infinite',
        'float':        'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px 0px rgb(0 132 214 / 0.3)' },
          '50%':      { boxShadow: '0 0 25px 5px rgb(0 132 214 / 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
