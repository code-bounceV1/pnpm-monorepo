import type { AuthConfig } from "./types";

let _config: AuthConfig | null = null;

export function initAuth(config: AuthConfig): void {
  _config = config;
}

export function getConfig(): AuthConfig {
  if (!_config) {
    throw new Error(
      "[auth-mobile] Not initialised. Call initAuth(config) at app startup before using any auth hooks or actions.",
    );
  }
  return _config;
}
