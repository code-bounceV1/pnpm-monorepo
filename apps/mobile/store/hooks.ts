// apps/my-app/store/hooks.ts
import { createStoreHooks } from "@pnpm-monorepo/store";
import { store } from "./index";

export const { useAppDispatch, useAppSelector } = createStoreHooks(store);
