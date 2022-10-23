/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      purple: {
        90: '#352C98',
        80: '#564CCD',
        70: '#7F75E9',
        10: '#DFDDF5',
      },
      gray: {
        90: '#121926',
        80: '#202939',
        70: '#364152',
        60: '#4B5565',
        50: '#697586',
        40: '#9AA3B2',
        30: '#C5CDD8',
        20: '#DADFE7',
        10: '#F2F4F8',
      },
      green: {
        90: '#5B8A53',
        10: '#E1F4DE',
      },
      red: {
        90: '#B63A44',
        10: '#FBDFDF',
      },
      gold: {
        90: '#C07A02',
        10: '#FBF1E0',
      },
    },
    extend: {},
  },
  plugins: [],
}
