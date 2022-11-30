// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      // Using a font-size * 1.4 multiplier line-height
      '2xs': ['0.625rem', '0.875rem'], // FS: 10px, LH: 14px
      xs: ['0.75rem', '1.0625rem'], // FS: 12px, LH: 17px
      sm: ['0.875rem', '1.25rem'], // FS: 14px, LH: 20px
      base: ['1rem', '1.375rem'], // FS: 16px, LH: 22px
      lg: ['1.125rem', '1.5625rem'], // FS: 18px, LH: 25px
      xl: ['1.25rem', '1.75rem'], // FS: 20px, LH: 28px
      '2xl': ['1.5rem', '2.125rem'], // FS: 24px, LH: 28px
      '3xl': ['2rem', '2.8125rem'], // FS: 32px, LH: 45px
      '4xl': ['2.25rem', '3.125rem'], // FS: 36px, LH: 50px
    },
    boxShadow: {
      sm: '0px 0px 5px 0px rgb(0, 0, 0)',
      md: '0px 0px 5px 0.1px rgb(0, 0, 0)',
      lg: '0px 0px 5px 0.2px rgb(0, 0, 0)',
      glow: '0px 0px 5px 0px rgb(218, 223, 231)',
      none: defaultTheme.boxShadow.none,
    },
    colors: {
      white: '#FFFFFF',
      transparent: 'transparent',
      purple: {
        90: '#352C98',
        80: '#564CCD',
        70: '#7F75E9',
        20: '#DFDDF5',
        10: '#F0EFFA',
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
        40: '#D8414D',
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
