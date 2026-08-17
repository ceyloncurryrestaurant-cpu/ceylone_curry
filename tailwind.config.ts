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
          volcanic: "#10100D",        // Main Background — Volcanic Black
          charcoal: "#191A14",        // Secondary Background — Charcoal Olive
          cocoa: "#292018",           // Warm Surface — Roasted Cocoa
          copper: {
            DEFAULT: "#C8783D",       // Primary Accent — Burnished Copper
            light: "#E08F50",
            dark: "#A65F2B",
          },
          saffron: {
            DEFAULT: "#E7A83B",       // Highlight — Saffron Ember
            light: "#F7C368",
            dark: "#C6851F",
          },
          chilli: {
            DEFAULT: "#B83A2E",       // Food Accent — Chilli Red
            dark: "#8F271D",
          },
          leaf: {
            DEFAULT: "#526348",       // Botanical Accent — Ceylon Leaf
            dark: "#3B4A33",
          },
          ivory: {
            DEFAULT: "#F5EBDD",       // Primary Text — Warm Ivory
            light: "#FAF4EC",
            dark: "#E3D5C3",
          },
          sandstone: "#B9A992",       // Secondary Text — Sandstone
          bronze: "#6D5138",          // Subtle Borders — Bronze Mist
          // Backwards compatibility tokens
          midnight: "#10100D",
          gold: "#E7A83B",
          cream: "#292018",
        },
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "var(--font-inter)", "sans-serif"],
        display: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        serifDisplay: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        copper: "0 8px 32px -4px rgba(200, 120, 61, 0.35)",
        "copper-lg": "0 14px 44px -4px rgba(200, 120, 61, 0.5)",
        saffron: "0 8px 32px -4px rgba(231, 168, 59, 0.35)",
        gold: "0 8px 32px -4px rgba(231, 168, 59, 0.35)",
        "gold-lg": "0 14px 44px -4px rgba(231, 168, 59, 0.5)",
        volcanic: "0 12px 40px -4px rgba(16, 16, 13, 0.9)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08) translate(-1%, -1%)" },
          "100%": { transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(229, 169, 60, 0.3)" },
          "50%": { boxShadow: "0 0 35px rgba(229, 169, 60, 0.7)" },
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
