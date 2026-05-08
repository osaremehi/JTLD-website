// client/tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef4fb',
          100: '#dae8f8',
          200: '#a8cdf0',
          300: '#7db0e8',
          400: '#5b93d4',
          500: '#3b6cb5',
          600: '#2a4f8a',
          700: '#1e3a68',
          800: '#172e54',
          900: '#0f2140',
          950: '#0a1628',
        },
        gold: {
          300: '#e8bf6a',
          400: '#daa73e',
          500: '#c9952c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
