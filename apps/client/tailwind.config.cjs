// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    boxShadow: {
      sm: '0px 0px 5px 0px rgb(0, 0, 0)',
      md: '0px 0px 5px 0.1px rgb(0, 0, 0)',
      lg: '0px 0px 5px 0.2px rgb(0, 0, 0)',
      card: '0px 0px 5px 0px rgb(218, 223, 231)',
      none: defaultTheme.boxShadow.none,
    },
    colors: {
      white: '#FFFFFF',
      transparent: 'transparent',
      purple: {
        90: '#352C98',
        80: '#564CCD',
        70: '#7F75E9',
        10: '#DFDDF5',
      },
      gray: {
        100: '#121926',
        90: '#202939',
        80: '#364152',
        70: '#4B5565',
        60: '#697586',
        50: '#9AA3B2',
        40: '#C5CDD8',
        30: '#DADFE7',
        20: '#EBEFF4',
        10: '#FAFAFA',
      },
      green: {
        90: '#5B8A53',
        60: '#3EC729',
        10: '#E1F4DE',
      },
      red: {
        90: '#B63A44',
        60: '#C72936',
        10: '#FBDFDF',
      },
      yellow: {
        90: '#C07A02',
        60: '#C78D29',
        10: '#FBF1E0',
      },
    },
    extend: {
      fontFamily: {
        charis: ['Charis', 'serif'],
        inter: ['Inter', 'sans-serif'],
        istokWeb: ['IstokWeb', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
