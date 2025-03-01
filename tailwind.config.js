import PrimeUI from 'tailwindcss-primeui';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,vue,ts}", "/index.hmtl"],
  theme: {
    extend: {},
  },
  plugins: [PrimeUI],
  prefix: 'tw-'
};
