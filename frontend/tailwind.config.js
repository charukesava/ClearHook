/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(139, 92, 246, 0.18), 0 18px 60px rgba(8, 15, 34, 0.55)'
      }
    }
  },
  plugins: []
}