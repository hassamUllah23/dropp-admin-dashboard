/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        darkblack: '#0B0B0B',
        gray: {
          100: '#242424',
          150: 'rgba(255, 255, 255, 0.15)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
          400: 'rgba(255, 255, 255, 0.4)',
          500: 'rgba(255, 255, 255, 0.5)',
          600: 'rgba(255, 255, 255, 0.6)',
          700: 'rgba(255, 255, 255, 0.7)',
          800: 'rgba(255, 255, 255, 0.8)',
        },
        black: {
          100: '#000000',
          200: 'rgba(12, 12, 12, 1)',
        },
        lightGray: {
          100: '#d3d3d3',
          200: 'rgba(140, 140, 140, 1)',
        },
        dodgerblue: '#14C7FF',
        white: '#fff',
        orange: '#ea920f',
        gainsboro: {
          100: 'rgba(217, 217, 217, 0.3)',
          200: 'rgba(217, 217, 217, 0.6)',
        },
        black: '#000',
        indianred: '#e95856',
      },
      borderRadius: {
        '8xs': '5px',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '22px',
        '3xl': '24px',
        '5xl': '24px',
        '6xl': '28px',
        '8xl': '40px',
        inherit: 'inherit',
      },
      maxWidth: {
        'screen-3xl': '1920px',
      },
      flex: {
        '30': '0 0 30px',
        '48': '0 0 48px',
      },
    },
    corePlugins: {
      preflight: false,
    },
  },
};
