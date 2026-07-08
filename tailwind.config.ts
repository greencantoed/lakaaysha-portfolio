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
        credits: ['Archivo', 'sans-serif'],
        zine: ['Anton', 'Impact', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
        hand: ['Caveat', 'cursive'],
        reader: ['Newsreader', 'Georgia', 'serif'],
        typewriter: ['"Special Elite"', 'Courier', 'monospace'],
        tc: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // World-reactive palette: RGB triplets live in index.css and flip
        // when <html data-world="page"> — shared chrome re-themes for free.
        jelly: {
          ink: 'rgb(var(--w-bg) / <alpha-value>)',
          surface: 'rgb(var(--w-surface) / <alpha-value>)',
          'surface-2': 'rgb(var(--w-surface2) / <alpha-value>)',
          line: 'rgb(var(--w-line) / <alpha-value>)',
          text: 'rgb(var(--w-text) / <alpha-value>)',
          muted: 'rgb(var(--w-muted) / <alpha-value>)',
          accent: 'rgb(var(--w-accent) / <alpha-value>)',
          'accent-2': 'rgb(var(--w-accent2) / <alpha-value>)',
          paper: '#f2f3f9',
        },
        // The thread also flips: vermillion REC light on film,
        // hot pink marker on paper.
        thread: {
          DEFAULT: 'rgb(var(--w-thread) / <alpha-value>)',
          deep: 'rgb(var(--w-thread-deep) / <alpha-value>)',
        },
        // Fixed zine palette for writer-native components.
        zine: {
          paper: '#fffdfa',
          card: '#ffffff',
          rule: '#c9d9ec',
          ink: '#141312',
          soft: '#4c4a45',
          faint: '#8a867e',
          pink: '#ed2079',
          'pink-deep': '#c40e60',
          red: '#e02318',
        },
      },
    },
  },
  plugins: [],
};
