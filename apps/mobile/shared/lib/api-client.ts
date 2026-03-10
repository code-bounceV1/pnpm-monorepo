// apps/my-app/lib/api.ts
import { createApiClient } from "@pnpm-monorepo/api-client";

export const apiClient = createApiClient({
  baseURL: "http://localhost:8089/api",
});
