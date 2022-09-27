/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      spacing: {
        128: '32rem',
        160: '40rem',
        184: '52rem',
        256:'104rem'
      },
      colors: {
      'primary': '#1f71a5',
      'secondary': '#275e9d',
      'tpkwhite': '#f7f7f7',
      'tpkerror': '#e44e4d',
      'tpkvalidate': '#50e2ad',
      'grey1': '#e1e1e0',
      'grey2': '#a1a1a0',
      'grey3': '#71716f',
      'grey4': '"3c3c3b',
    }
   },
  },
  plugins: [],
}

