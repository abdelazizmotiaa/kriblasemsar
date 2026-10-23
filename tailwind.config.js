/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcf5',
          100: '#d7f7e6',
          200: '#b2edd0',
          300: '#7dddb3',
          400: '#43c490',
          500: '#1ea673',
          600: '#13855a',
          700: '#116a49',
          800: '#11543b',
          900: '#104532',
          950: '#03261a',
        },
        navy: {
          800: '#0e1e38',
          900: '#091326',
          950: '#040914',
        },
        accent: {
          blue: '#2563eb',
          green: '#10b981',
          orange: '#f97316',
          coral: '#ff5a5f',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'bubble': '0 4px 14px 0 rgba(0, 0, 0, 0.22)',
        'bubble-active': '0 6px 20px 0 rgba(0, 0, 0, 0.35)',
        'card': '0 2px 12px -2px rgba(0, 0, 0, 0.08), 0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        'sheet': '0 -8px 24px -4px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
