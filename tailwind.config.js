/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      'xs': '375px',     // iPhone SE, small phones
      'sm': '428px',     // iPhone Pro Max, large phones
      'md': '768px',     // Tablets in portrait
      'lg': '1024px',    // Small laptops
      'xl': '1280px',    // Desktop
      '2xl': '1536px',   // Large desktop
    },
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      maxWidth: {
        'mobile': '430px', // Max width for mobile devices
      },
      minHeight: {
        'screen-ios': '100vh',
        'screen-android': '100dvh',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      }
    },
  },
  plugins: [],
}