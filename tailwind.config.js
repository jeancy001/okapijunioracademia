/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
     theme: {
    extend: {
      colors: {
        okapiBlue: "#3B82F6",
        okapiYellow: "#FACC15",
        okapiPink: "#FB7185",
      },
    },
  },
  },
  plugins: [],
}

