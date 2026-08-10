/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        'accent-red': {
          DEFAULT: '#A50044',
          dark: '#7a0032',
          deep: '#5f0027',
          soft: 'rgba(165, 0, 68, 0.4)',
        },
        'accent-gold': {
          DEFAULT: '#EDBB00',
          soft: 'rgba(237, 187, 0, 0.3)',
          glow: 'rgba(237, 187, 0, 0.15)',
        },
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.03)',
          hover: 'rgba(255, 255, 255, 0.07)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 20s infinite linear',
        'lanyard-sway': 'lanyardSway 3s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.4', width: '50px' },
          '50%': { opacity: '1', width: '100px' },
        },
        float: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: '0' },
        },
        lanyardSway: {
          '0%': { transform: 'translateX(-50%) rotate(-3deg)' },
          '100%': { transform: 'translateX(-50%) rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
};
