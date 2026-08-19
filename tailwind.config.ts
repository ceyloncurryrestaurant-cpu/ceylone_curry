import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ceylon: {
          volcanic: "#071B5C",        // Royal Navy Blue Main Background
          charcoal: "#0A2472",        // Rich Deep Blue Secondary Background
          cocoa: "#0E3094",           // Vibrant Blue Surface Card
          navy: "#071B5C",
          "blue-deep": "#0A2472",
          "blue-light": "#1E40AF",
          copper: {
            DEFAULT: "#F5B91A",       // Warm Luxury Ceylon Gold Primary Accent
            light: "#FFC928",
            dark: "#D49D0E",
          },
          saffron: {
            DEFAULT: "#F5B91A",       // Curry Gold Accent for Prices & Highlights
            light: "#FFC928",
            dark: "#D49D0E",
          },
          chilli: {
            DEFAULT: "#D92720",       // Food Accent — Chilli Red
            dark: "#B01A14",
          },
          leaf: {
            DEFAULT: "#10B981",       // Fresh Mint Green Accent
            dark: "#059669",
          },
          ivory: {
            DEFAULT: "#FFFFFF",       // Crisp Pure White Primary Text
            light: "#F8FAFC",
            dark: "#E2E8F0",
          },
          sandstone: "#CBD5E1",       // Soft Slate White Secondary Text
          bronze: "#1E3A8A",          // Royal Blue Subtle Borders
          // Backwards compatibility tokens
          midnight: "#071B5C",
          gold: "#F5B91A",
          cream: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "var(--font-inter)", "sans-serif"],
        display: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        serifDisplay: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        copper: "0 8px 32px -4px rgba(245, 185, 26, 0.45)",
        "copper-lg": "0 14px 44px -4px rgba(245, 185, 26, 0.65)",
        saffron: "0 8px 32px -4px rgba(245, 185, 26, 0.45)",
        gold: "0 8px 32px -4px rgba(245, 185, 26, 0.45)",
        "gold-lg": "0 14px 44px -4px rgba(245, 185, 26, 0.65)",
        volcanic: "0 12px 40px -4px rgba(7, 27, 92, 0.9)",
        glass: "0 8px 32px 0 rgba(7, 27, 92, 0.7)",
        navy: "0 14px 44px -4px rgba(7, 27, 92, 0.8)",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08) translate(-1%, -1%)" },
          "100%": { transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(245, 185, 26, 0.4)" },
          "50%": { boxShadow: "0 0 35px rgba(245, 185, 26, 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(15px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        kenburns: "kenburns 25s infinite ease-in-out alternate",
        "pulse-glow": "pulseGlow 3s infinite ease-in-out",
        float: "float 5s infinite ease-in-out",
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-left": "slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-right": "slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
