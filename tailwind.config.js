/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      screens: {
        sm: "100%",
        md: "100%",
        lg: "100%",
        xl: "100%",
        "2xl": "1600px",
      },
    },
    fontFamily: {
      bantiqua: ["Book Antiqua", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#FE2C55",
      },
    },
  },
  plugins: [],
};
