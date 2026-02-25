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

// Custom resolver to handle @ alias for different packages
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("@/")) {
    const originModulePath = context.originModulePath;

    // If import is from ui-mobile package, resolve relative to ui-mobile
    if (originModulePath.includes("packages/ui-mobile")) {
      const uiMobileRoot = path.resolve(workspaceRoot, "packages/ui-mobile");
      const relativePath = moduleName.slice(2); // Remove '@/'
      return context.resolveRequest(
        context,
        path.join(uiMobileRoot, relativePath),
        platform,
      );
    }

    // If import is from mobile app, resolve relative to mobile app
    if (originModulePath.includes("apps/mobile")) {
      const mobileRoot = path.resolve(workspaceRoot, "apps/mobile");
      const relativePath = moduleName.slice(2); // Remove '@/'
      return context.resolveRequest(
        context,
        path.join(mobileRoot, relativePath),
        platform,
      );
    }
  }

  // Default resolver
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, {
  input: path.resolve(workspaceRoot, "packages/ui-mobile/global.css"),
  inlineRem: 16,
});
