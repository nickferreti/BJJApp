/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            // Academy theme colors could go here
            primary: "#000000", // Placeholder
            secondary: "#ffffff",
        }
      },
    },
    plugins: [],
  }
