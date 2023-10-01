/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        pong: '0px -2px 0px 0px #3C3B6C'
      },
      colors: {
        pong: {
          purple: {
            100: '#6659FD',
            200: '#473ADE',
            300: '#6659FD',
            400: '#6659FD',
            500: '#6659FD',
            600: '#6659FD',
            700: '#6659FD',
            800: '#6659FD',
            900: '#6659FD'
          },
          white: '#ECEDFF',
          blue: {
            100: '#6E6FA5',
            200: '#38396F',
            300: '#2A2957',
            400: '#24244F',
            500: '#161748',
            600: '#3C3B6C',
            700: '#161748',
            800: '#161748',
            900: '#161748'
          }
        }
      }
    }
  },
  plugins: []
};
