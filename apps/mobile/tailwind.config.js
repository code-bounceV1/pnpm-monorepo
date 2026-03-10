const uiMobileConfig = require("@pnpm-monorepo/ui-mobile/tailwind.config");
const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [uiMobileConfig],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./shared/**/*.{ts,tsx}",
    "../../packages/ui-mobile/components/**/*.{ts,tsx}",
    "../../packages/ui-mobile/lib/**/*.{ts,tsx}",
    "../../packages/ui-mobile/index.ts",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit-Regular"],
        "outfit-medium": ["Outfit-Medium"],
        "outfit-bold": ["Outfit-Bold"],
        "outfit-semibold": ["Outfit-SemiBold"],
        "outfit-extrabold": ["Outfit-ExtraBold"],
        "outfit-black": ["Outfit-Black"],
        "outfit-light": ["Outfit-Light"],
        "outfit-thin": ["Outfit-Thin"],
        "outfit-extralight": ["Outfit-ExtraLight"],
      },
    },
  },
};
