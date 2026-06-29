/** @type {import('tailwindcss').Config} */
const withAlpha = (v) => `hsl(var(${v}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // NativeWind reads prefers-color-scheme; "media" makes the dark block above active automatically.
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        background: withAlpha("--color-background"),
        surface: withAlpha("--color-surface"),
        muted: withAlpha("--color-muted"),
        border: withAlpha("--color-border"),
        text: {
          DEFAULT: withAlpha("--color-text"), // text-text
          soft: withAlpha("--color-text-soft"), // text-text-soft
        },
        primary: {
          DEFAULT: withAlpha("--color-primary"), // bg-primary
          foreground: withAlpha("--color-primary-foreground"),
        },
        accent: {
          DEFAULT: withAlpha("--color-accent"), // bg-accent
          foreground: withAlpha("--color-accent-foreground"),
        },
      },
      fontFamily: {
        // Loaded via @expo-google-fonts in app/_layout.tsx. Falls back to
        // system if a face isn't loaded yet, so the screen never breaks.
        display: ["BricolageGrotesque_700Bold"],
        sans: ["PlusJakartaSans_500Medium"],
        body: ["PlusJakartaSans_400Regular"],
        mono: ["SpaceMono_400Regular"],
      },
    },
  },
  plugins: [],
};