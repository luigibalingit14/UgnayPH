import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyber-Pinoy Theme
        background: "#080c14",
        foreground: "#f8fafc",
        primary: {
          DEFAULT: "#FCD116", // Sun Gold
          foreground: "#080c14",
        },
        secondary: {
          DEFAULT: "#0038A8", // Royal Azure
          foreground: "#f8fafc",
        },
        accent: {
          DEFAULT: "#CE1126", // Deep Scarlet
          foreground: "#f8fafc",
        },
        ph: {
          blue: "#0038A8",
          red: "#CE1126",
          yellow: "#FCD116",
          white: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1e1b4b",
          foreground: "#94a3b8",
        },
        card: {
          DEFAULT: "#1e1b4b",
          foreground: "#f8fafc",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#f8fafc",
        },
        border: "#312e81",
        input: "#312e81",
        ring: "#FCD116",
        // Vibe Meter Colors
        vibe: {
          safe: "#22c55e",
          caution: "#facc15",
          danger: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(252, 209, 22, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(252, 209, 22, 0.6)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-medium": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        }
      },
      animation: {
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-medium": "float-medium 4s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
