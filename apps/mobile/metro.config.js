const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 👇 Important for pnpm monorepo
config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 👇 If you REALLY want to use "@/..."
config.resolver.alias = {
  "@": path.resolve(workspaceRoot, "packages/ui-mobile"),
};

module.exports = withNativeWind(config, {
  input: path.resolve(workspaceRoot, "packages/ui-mobile/global.css"),
  inlineRem: 16,
});
