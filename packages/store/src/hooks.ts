import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";

export type ExtractRootState<S> = S extends { getState: () => infer R }
  ? R
  : never;
export type ExtractDispatch<S> = S extends { dispatch: infer D } ? D : never;

export function createStoreHooks<
  S extends { getState: () => any; dispatch: Dispatch<UnknownAction> },
>(store: S) {
  type RootState = ExtractRootState<S>;
  type AppDispatch = ExtractDispatch<S>;

  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

  return { useAppDispatch, useAppSelector };
}
