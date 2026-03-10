import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

export type AuthUser = FirebaseAuthTypes.User;

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export interface OAuthState {
  loading: boolean;
  error: string | null;
}

export interface AuthConfig {
  googleWebClientId: string;
  googleAndroidClientId: string;
  androidRedirectUri: string;
  microsoftClientId: string;
  microsoftTenantId: string;
}
