/** @type {import('tailwindcss').Config} */

const color = {
  guava: {
    100: "#FFF3EF",
    500: "#F45D48",
  },
  kale: {
    100: "#F7FCFC",
    500: "#0A8080",
    800: "#005961",
  },
  salt: {
    100: "#ffffff",
    200: "#FBFAFA",
    900: "#525257",
    1000: "#1C1C1C",
  },
};

module.exports = {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx,css}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: color.guava[500],
        },
        secondary: {
          DEFAULT: color.kale[800],
        },
        text: {
          primary: {
            DEFAULT: color.salt[900],
          },
          secondary: {
            DEFAULT: color.salt[800],
          },
        },
        link: {
          DEFAULT: color.kale[500],
          hover: color.kale[800],
        },
        background: {
          DEFAULT: color.salt[100],
        },
        border: {
          DEFAULT: color.salt[900],
        },
      },
    },
  },
  plugins: [],
};
