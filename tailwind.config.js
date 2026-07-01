/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary - Coral Red (Exact from your palette)
        primary: {
          50: "#FFF8F5",
          100: "#FFE0E3",
          200: "#FFCCD2",
          300: "#FF8A80",
          400: "#FF4D6D",
          500: "#E53935",
          600: "#C0392B",
          700: "#922B21",
          800: "#641E16",
          900: "#2D0A0A",
        },
        // Secondary - Blush Pink (Exact from your palette)
        secondary: {
          50: "#FFF5F5",
          100: "#FFE0E3",
          200: "#FFBFC6",
          300: "#FF8096",
          400: "#FF4D6D",
          500: "#E8285A",
          600: "#C21E4A",
          700: "#8B1538",
          800: "#5C0D25",
          900: "#2D0614",
        },
        // Warm Gray (Neutral)
        warmGray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
          950: "#0D0D0D",
        },
        // Semantic Colors
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
    },
  },
  plugins: [],
}

