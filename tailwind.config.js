/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0e1a",
        surface: "#111827",
        "surface-2": "#1a2234",
        border: "#1e293b",
        primary: "#6366f1",
        "primary-hover": "#4f46e5",
        accent: "#00d4ff",
        muted: "#64748b",
        "text-primary": "#e2e8f0",
        "text-secondary": "#94a3b8",
      },
    },
  },
  plugins: [],
}