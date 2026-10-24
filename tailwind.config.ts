import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        outline: "var(--outline)",
        primary: {
          DEFAULT: "var(--primary)",
          container: "var(--primary-container)",
        },
        "on-primary": "var(--on-primary)",
        "on-primary-container": "var(--on-primary-container)",
        secondary: {
          DEFAULT: "var(--secondary)",
          container: "var(--secondary-container)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          container: "var(--tertiary-container)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
      },
      borderRadius: {
        card: "28px",
        input: "22px",
        dialog: "30px",
        pill: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-roboto-flex)", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
