import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-alt": "var(--color-surface-alt)",
        border: "var(--color-border)",
        ink: "var(--color-text)",
        "ink-muted": "var(--color-text-muted)",
        accent: {
          DEFAULT: "var(--color-accent)",
          contrast: "var(--color-accent-contrast)",
          soft: "var(--color-accent-soft)",
        },
        up: {
          DEFAULT: "var(--color-up)",
          soft: "var(--color-up-soft)",
        },
        down: {
          DEFAULT: "var(--color-down)",
          soft: "var(--color-down-soft)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 15, 8, 0.06), 0 8px 24px -12px rgba(20, 15, 8, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
