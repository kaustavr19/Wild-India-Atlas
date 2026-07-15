import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["lg:hidden", "lg:block", "lg:grid"],
  theme: {
    extend: {
      colors: {
        forest: { 50: "#f0f7ef", 100: "#dbeed9", 300: "#8fc28a", 500: "#3c7f48", 700: "#24563a", 900: "#142f25" },
        sand: "#d8b56d",
        ivory: "#fbf7ec",
        amberfield: "#d98c2b",
        river: "#2f7da1",
        basalt: "#273238",
        clay: "#b5592f",
        moss: "#6f7d3c",
        bark: "#5a3d26",
        flare: "#d7e64c",
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        biome: {
          surface: "rgb(var(--biome-surface-rgb) / <alpha-value>)",
          soft: "rgb(var(--biome-soft-rgb) / <alpha-value>)",
          accent: "rgb(var(--biome-accent-rgb) / <alpha-value>)",
          secondary: "rgb(var(--biome-secondary-rgb) / <alpha-value>)",
          ink: "rgb(var(--biome-ink-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        field: "var(--shadow-field)",
        lift: "var(--shadow-lift)",
        insetGlow: "inset 0 0 0 1px rgb(255 255 255 / 0.12), inset 0 1px 0 rgb(255 255 255 / 0.08)",
      },
      borderRadius: { field: "var(--radius-field)" },
      transitionTimingFunction: {
        field: "var(--ease-field)",
        settle: "var(--ease-settle)",
      },
    },
  },
  plugins: [],
};

export default config;
