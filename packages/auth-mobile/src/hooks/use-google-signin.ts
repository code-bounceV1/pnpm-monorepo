import { useState, useCallback } from "react";
import { Platform } from "react-native";
import {
  AuthRequest,
  makeRedirectUri,
  ResponseType,
  DiscoveryDocument,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider } from "@react-native-firebase/auth";
import { firebaseAuth } from "../firebase";
import { getConfig } from "../config";
import type { OAuthState } from "../types";

WebBrowser.maybeCompleteAuthSession();

const googleDiscovery: DiscoveryDocument = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export function useGoogleSignIn(): OAuthState & {
  signInWithGoogle: () => Promise<void>;
} {
  const [state, setState] = useState<OAuthState>({
    loading: false,
    error: null,
  });

  const signInWithGoogle = useCallback(async () => {
    const config = getConfig();
    const isAndroid = Platform.OS === "android";
    const clientId = isAndroid
      ? config.googleAndroidClientId
      : config.googleWebClientId;
    const googleRedirectUri = isAndroid
      ? config.androidRedirectUri
      : makeRedirectUri({});

    try {
      setState({ loading: true, error: null });

      const request = new AuthRequest({
        clientId,
        redirectUri: googleRedirectUri,
        scopes: ["openid", "profile", "email"],
        responseType: isAndroid ? ResponseType.Code : ResponseType.IdToken,
        usePKCE: isAndroid,
        extraParams: {
          nonce: "nonce_" + Math.random().toString(36).substring(7),
        },
      });

      const result = await request.promptAsync(googleDiscovery);

      if (result.type === "success") {
        if (isAndroid && result.params?.code) {
          const tokenResponse = await fetch(googleDiscovery.tokenEndpoint!, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: clientId,
              code: result.params.code,
              redirect_uri: googleRedirectUri,
              grant_type: "authorization_code",
              code_verifier: request.codeVerifier || "",
            }).toString(),
          });
          const tokens = await tokenResponse.json();
          if (tokens.id_token) {
            const credential = GoogleAuthProvider.credential(tokens.id_token);
            await firebaseAuth.signInWithCredential(credential);
            setState({ loading: false, error: null });
          } else {
            setState({
              loading: false,
              error: tokens.error_description || "Google token exchange failed",
            });
          }
        } else if (!isAndroid && result.params?.id_token) {
          const credential = GoogleAuthProvider.credential(
            result.params.id_token,
          );
          await firebaseAuth.signInWithCredential(credential);
          setState({ loading: false, error: null });
        } else {
          setState({ loading: false, error: null });
        }
      } else if (result.type === "error") {
        setState({
          loading: false,
          error: result.params?.error_description || "Google sign-in failed",
        });
      } else {
        setState({ loading: false, error: null });
      }
    } catch (err: any) {
      setState({
        loading: false,
        error: err.message || "Google sign-in failed",
      });
    }
  }, []);

  return { ...state, signInWithGoogle };
}
