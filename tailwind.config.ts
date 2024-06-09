const { fontFamily } = require("tailwindcss/defaultTheme");
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "collapsible-down": {
          from: { height: "0", opacity: "0" },
          to: {
            height: "var(--radix-collapsible-content-height)",
          },
        },
        "collapsible-up": {
          from: {
            height: "var(--radix-collapsible-content-height)",
          },
          to: { height: "0", opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0", opacity: "0.5" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0", opacity: "0.5" },
        },
        "dialog-in": {
          from: { transform: "scale(0.95) translate(-50%, 0)", opacity: "0" },
          to: { transform: "scale(1) translate(-50%, 0)" },
        },
        "dialog-out": {
          from: { transform: "scale(1) translate(-50%, 0)" },
          to: { transform: "scale(0.95) translateY(-50%, 0)", opacity: "0" },
        },
        "popover-in": {
          from: { opacity: "0", transform: "scale(0.95) translateY(-10px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "popover-out": {
          from: { opacity: "1", transform: "scale(1) translateY(0)" },
          to: { opacity: "0", transform: "scale(0.95) translateY(-10px)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          to: { opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 300ms ease",
        "fade-out": "fade-out 300ms ease",
        "dialog-in": "dialog-in 200ms cubic-bezier(0.32, 0.72, 0, 1)",
        "dialog-out": "dialog-out 300ms cubic-bezier(0.32, 0.72, 0, 1)",
        "popover-in": "popover-in 150ms ease",
        "popover-out": "popover-out 150ms ease",
        "collapsible-down": "collapsible-down 150ms ease-out",
        "collapsible-up": "collapsible-up 150ms ease-out",
        "accordion-down": "accordion-down 200ms ease-out",
        "accordion-up": "accordion-up 200ms ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
