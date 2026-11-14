/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          500: '#1E3D6B',
          700: '#142B4A',
          800: '#0F213A',
          900: '#091424',
        },
        teal: {
          50: '#E6F8F6',
          100: '#C2EFEB',
          400: '#14B8A6',
          500: '#0F9D91',
          600: '#0B8278',
          700: '#08635B',
        },
        surface: {
          bg: '#F7F9FC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#202B3C',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
