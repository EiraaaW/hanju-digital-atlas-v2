/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050508',
          900: '#0a0a10',
          850: '#121018',
        },
        gold: {
          500: '#c9a24d',
          400: '#d4b25f',
        },
      },
      fontFamily: {
        display: ['"Noto Serif SC"', 'SimSun', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel:
          '0 0 0 1px rgba(201, 162, 77, 0.12), 0 20px 40px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
