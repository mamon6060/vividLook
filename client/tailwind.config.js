/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        robo: ["Roboto", "sans-serif"], // Corrected fallback font family
      },
      animation2: {
        slide: "slide 1.5s ease-in-out infinite",
      },
      
      colors: {
        primary: "#178843",
        secondary: "#F4A51D",
        text: "#292929",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
      screens: {
        'height-900': { raw: '(max-height: 900px)' },
        'height-600': { raw: '(max-height: 600px)' },
      },
    },

    keyframes: {
      slide: {
        "0%": { transform: "translateX(0)" },
        "50%": { transform: "translateX(20px)" },
        "100%": { transform: "translateX(0)" },
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
  plugins: [],
};

// "Roboto", sans-serif 178843
