/** @type {import('tailwindcss').Config} */

const color = {
  brand: {
    100: "#FFF3EF",
    500: "#F45D48",
  },
  accent: {
    100: "#F7FCFC",
    500: "#0A8080",
    800: "#005961",
  },
  neutral: {
    100: "#ffffff",
    200: "#FBFAFA",
    900: "#525257",
    1000: "#1C1C1C",
  },
};

export const content = ["index.html", "./src/**/*.{js,jsx,ts,tsx,css}"];
export const darkMode = false;
export const theme = {
  extend: {
    colors: {
      primary: {
        DEFAULT: color.brand[500],
      },
      secondary: {
        DEFAULT: color.accent[800],
      },
      text: {
        primary: {
          DEFAULT: color.neutral[900],
        },
        secondary: {
          DEFAULT: color.neutral[800],
        },
      },
      link: {
        DEFAULT: color.accent[500],
        hover: color.accent[800],
      },
      background: {
        DEFAULT: color.neutral[100],
      },
      border: {
        DEFAULT: color.neutral[900],
      },
    },
  },
};
export const plugins = [];
