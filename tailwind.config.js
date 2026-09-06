/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#0a0a0f',
        midnight: '#12111a',
        elevated: '#1a1827',
        primary: {
          DEFAULT: '#a855f7',
          deep: '#6b21a8',
          hyper: '#9333ea',
          soft: '#c084fc',
        },
        brand: {
          obsidian: '#0a0a0f',
          midnight: '#12111a',
          elevated: '#1a1827',
        },
        accent: {
          amber: '#facc15'
        }
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
        xl: '1.5rem',   // 24px
        lg: '1rem',     // 16px
        md: '0.5rem',   // 8px
        sm: '0.25rem',  // 4px
      },
    },
  },
  plugins: [],
}
