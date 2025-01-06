/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#BDEB00",
        secondary: {
          100: "#1E1F25",
          200:"#3b82f647", //  "bleu",
          900:"#F4F5FA",
          
        },
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
