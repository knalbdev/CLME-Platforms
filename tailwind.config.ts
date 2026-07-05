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
          50:  '#eff4ff',
          100: '#dce8ff',
          200: '#c2d3ff',
          300: '#96b7ff',
          400: '#6292ff',
          500: '#3266ff',
          600: '#0052FF',
          700: '#0044e0',
          800: '#0037b8',
          900: '#002e96',
          950: '#001a5e',
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
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
        'pop':        'pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float':      'float 3.5s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'reveal':     'reveal 0.65s cubic-bezier(0.16,1,0.3,1) forwards',
        'count-up':   'countUp 0.5s ease-out forwards',
        'shimmer':    'shimmer 2.5s linear infinite',
        'glow':       'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0', transform: 'translateY(6px)' },  to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pop:      { from: { opacity: '0', transform: 'scale(0.6)' },       to: { opacity: '1', transform: 'scale(1)' } },
        float:    { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        reveal:   { from: { opacity: '0', transform: 'translateY(32px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        countUp:  { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        glow:     { '0%,100%': { boxShadow: '0 0 12px 2px rgba(0,82,255,0.25)' }, '50%': { boxShadow: '0 0 28px 6px rgba(0,82,255,0.45)' } },
      },
    },
  },
  plugins: [],
}
export default config
