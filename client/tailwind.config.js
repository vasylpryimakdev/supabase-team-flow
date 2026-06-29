export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        card: "var(--card)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--text-muted)",
        primary: "var(--primary)",
        "primary-text": "var(--primary-text)",
      },
    },
  },
  plugins: [],
};
