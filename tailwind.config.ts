/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        jelly: {
          ink: '#040409',
          surface: '#0a0d1a',
          'surface-2': '#13182f',
          line: '#2a3154',
          text: '#eef1ff',
          muted: '#a5adc8',
          accent: '#ff2f92',
          'accent-2': '#ff6fb3',
          paper: '#f2f3f9',
        },
      },
    },
  },
  plugins: [],
};
