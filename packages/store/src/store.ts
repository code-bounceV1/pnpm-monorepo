import {
  configureStore,
  combineReducers,
  Reducer,
  UnknownAction,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import type { Storage } from "redux-persist";
import alertReducer from "./slices/alert.slice";
import type { AlertState } from "./slices/alert.slice";

export interface SlicePersistConfig {
  storage: Storage;
  whitelist?: string[];
  blacklist?: string[];
  key?: string;
}

export interface SliceConfig<S = any> {
  reducer: Reducer<S, UnknownAction>;
  persist?: SlicePersistConfig;
}

type StateFromSliceConfig<C> = C extends SliceConfig<infer S> ? S : never;

type StateFromSlicesMap<T extends Record<string, SliceConfig>> = {
  [K in keyof T]: StateFromSliceConfig<T[K]>;
};

export interface CreateAppStoreOptions<T extends Record<string, SliceConfig>> {
  slices?: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildReducer(
  key: string,
  reducer: Reducer<any, UnknownAction>,
  persist: SlicePersistConfig | undefined,
): Reducer<any, UnknownAction> {
  if (!persist) return reducer;
  return persistReducer(
    {
      key: persist.key ?? key,
      storage: persist.storage,
      ...(persist.whitelist ? { whitelist: persist.whitelist } : {}),
      ...(persist.blacklist ? { blacklist: persist.blacklist } : {}),
    },
    reducer,
  );
}

export function createAppStore<T extends Record<string, SliceConfig>>({
  slices = {} as T,
}: CreateAppStoreOptions<T> = {}) {
  const appReducers = Object.entries(slices).reduce<
    Record<string, Reducer<any, UnknownAction>>
  >((acc, [key, { reducer, persist }]) => {
    acc[key] = buildReducer(key, reducer, persist);
    return acc;
  }, {});

  const rootReducer = combineReducers({
    alert: alertReducer,
    ...appReducers,
  });

  type RootState = { alert: AlertState } & StateFromSlicesMap<T>;

  const store = configureStore({
    reducer: rootReducer as unknown as Reducer<RootState, UnknownAction>,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const persistor = persistStore(store);

  return { store, persistor };
}

const { store: _baseStore } = createAppStore();
export type BaseRootState = ReturnType<typeof _baseStore.getState>;
export type AppDispatch = typeof _baseStore.dispatch;
