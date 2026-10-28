/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./website/**/*.{html,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#C89B3C',
          'gold-hover': '#B6882C',
          'gold-light': '#FDF8EC',
          'gold-dark': '#A07827',
          dark: '#14181B',
          card: '#1C1F24',
          surface: '#1F2429',
          muted: '#717D8A',
          border: '#E8ECEF',
          bg: '#F5F7FA'
        },
        primary: {
          DEFAULT: '#7b5900',
          container: '#c89b3c',
          fixed: '#ffdea4',
          'fixed-dim': '#f0bf5c',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#4b3500',
        secondary: {
          DEFAULT: '#5c5e63',
          container: '#dedfe5',
          fixed: '#e1e2e8',
        },
        'on-secondary': '#ffffff',
        tertiary: {
          DEFAULT: '#006d2f',
          container: '#00bb56',
          fixed: '#66ff8e',
        },
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#00431a',
        surface: {
          DEFAULT: '#f8f9fb',
          dim: '#d9dadc',
          bright: '#f8f9fb',
          'container-lowest': '#ffffff',
          'container-low': '#f3f4f6',
          container: '#edeef0',
          'container-high': '#e7e8ea',
          'container-highest': '#e1e2e4',
          variant: '#e1e2e4',
        },
        'on-surface': '#191c1e',
        'on-surface-variant': '#4e4637',
        'inverse-surface': '#2e3132',
        'inverse-on-surface': '#f0f1f3',
        outline: {
          DEFAULT: '#807665',
          variant: '#d2c5b1',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        background: '#f8f9fb',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Montserrat', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'nav': '0 -4px 20px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};
