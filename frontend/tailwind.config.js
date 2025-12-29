/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
       keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" }, // goes up by 15px
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite", // use animate-float
      },
    },
  },
  plugins: [],
}

