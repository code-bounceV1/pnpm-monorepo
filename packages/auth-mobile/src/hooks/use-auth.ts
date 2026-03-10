import { useEffect, useState } from "react";
import { firebaseAuth } from "../firebase";
import type { AuthState } from "../types";

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      setState({ user, loading: false, error: null });
    });

    return unsubscribe;
  }, []);

  return state;
}
