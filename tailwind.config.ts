import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf8',
          100: '#d0f5ea',
          200: '#a3ecd5',
          300: '#6ddcbc',
          400: '#34c49e',
          500: '#14a885',
          600: '#0c8568',
          700: '#0c6b55',
          800: '#0d5444',
          900: '#0d4639',
        },
        navy: {
          50:  '#eef2ff',
          100: '#dce5f7',
          200: '#bccbf0',
          300: '#8aa5e3',
          400: '#5477d0',
          500: '#3355b8',
          600: '#253f9c',
          700: '#1d3180',
          800: '#1a2960',
          900: '#0f1e3c',
          950: '#080e1d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'pop': 'pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pop: { from: { opacity: '0', transform: 'scale(0.6)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
export default config
