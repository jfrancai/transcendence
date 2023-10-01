/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif']
      },
      colors: {
        'blue-pong-1': '#6E6FA5',
        'blue-pong-2': '#2A2957',
        'blue-pong-3': '#1C1C45',
        'blue-pong-4': '#38396F',
        'green-login': '#00BABC'
      },
      backgroundImage: {
        default: "url('./images/background.png')",
        'profile-default': "url('./images/background_profile.png')"
      }
    }
  },
  plugins: []
};
