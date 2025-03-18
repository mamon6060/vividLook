/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#1a8e47",
      },
      colors: {
        primary: "#73b481",
        secondary: "#dcecde",
        tertiary: "#E8F9FF",
      },
    },
  },
  plugins: [],
};
