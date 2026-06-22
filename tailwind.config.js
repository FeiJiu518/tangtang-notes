/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        apple: {
          blue: '#007AFF',
          indigo: '#5856D6',
          purple: '#AF52DE',
          bg: '#f6f6f9',
          surface: '#ffffff',
        }
      },
      boxShadow: {
        'apple': '0 2px 8px rgba(0,0,0,0.04), 0 0 1px rgba(0,0,0,0.06)',
        'apple-md': '0 4px 16px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.06)',
        'apple-lg': '0 8px 30px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
      animation: {
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
