import React, { createContext, useContext } from "react";
import type { RBACContextValue, RBACUser } from "./types";

const RBACContext = createContext<RBACContextValue>({ user: null });

export interface RBACProviderProps {
  user: RBACUser | null;
  children: React.ReactNode;
}

export function RBACProvider({ user, children }: RBACProviderProps) {
  return (
    <RBACContext.Provider value={{ user }}>{children}</RBACContext.Provider>
  );
}

export function useRBACContext(): RBACContextValue {
  return useContext(RBACContext);
}
