const uiMobileConfig = require("@pnpm-monorepo/ui-mobile/tailwind.config");
const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [uiMobileConfig],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui-mobile/**/*.{ts,tsx}",
  ],
};
