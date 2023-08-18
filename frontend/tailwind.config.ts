/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        15: '3.75rem',
        18: '4.5rem',
        37.5: '9.375rem',
        70: '17.5rem',
      },
      fontFamily: {
        montserrat: ['Montserrat'],
        inter: ['Inter'],
        roboto: ['Roboto'],
      },
      colors: {
        primary: '#3056D3',
        warn: '#FF0000',
        black: '#212B36',
        mainBg: '#F9FAFB',
        mainText: '#637381',
        red: '#DC3545',
        green: '#3CA745',
        'gray-50': 'd5d6d8',
        'gray-100': '#ACB6BE',
        'gray-150': '#E3E3E3',
        'gray-200': '#F5F7FD',
        'gray-250': '#E9EDF9',
        'gray-300': '#E7E7E7',
      },
    },
  },
  plugins: [],
};
