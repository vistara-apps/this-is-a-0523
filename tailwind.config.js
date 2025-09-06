/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(210, 90%, 55%)',
          50: 'hsl(210, 90%, 95%)',
          100: 'hsl(210, 90%, 85%)',
          500: 'hsl(210, 90%, 55%)',
          600: 'hsl(210, 90%, 45%)',
          700: 'hsl(210, 90%, 35%)',
        },
        accent: {
          DEFAULT: 'hsl(180, 70%, 45%)',
          50: 'hsl(180, 70%, 95%)',
          100: 'hsl(180, 70%, 85%)',
          500: 'hsl(180, 70%, 45%)',
          600: 'hsl(180, 70%, 35%)',
        },
        background: 'hsl(220, 20%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
        text: 'hsl(220, 15%, 25%)',
        muted: 'hsl(220, 15%, 55%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 3px 0px hsla(0,0%,0%,0.1)',
        'md': '0 4px 6px -1px hsla(0,0%,0%,0.1), 0 2px 4px -2px hsla(0,0%,0%,0.1)',
        'lg': '0 10px 15px -3px hsla(0,0%,0%,0.1), 0 4px 6px -4px hsla(0,0%,0%,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}