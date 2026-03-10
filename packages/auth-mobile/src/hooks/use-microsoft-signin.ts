import { useState, useCallback } from "react";
import {
  makeRedirectUri,
  AuthRequest,
  ResponseType,
  DiscoveryDocument,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { OAuthProvider } from "@react-native-firebase/auth";
import { firebaseAuth } from "../firebase";
import { getConfig } from "../config";
import type { OAuthState } from "../types";

WebBrowser.maybeCompleteAuthSession();

export function useMicrosoftSignIn(): OAuthState & {
  signInWithMicrosoft: () => Promise<void>;
} {
  const [state, setState] = useState<OAuthState>({
    loading: false,
    error: null,
  });

  const signInWithMicrosoft = useCallback(async () => {
    const config = getConfig();
    const redirectUri = makeRedirectUri({ native: config.androidRedirectUri });

    const microsoftDiscovery: DiscoveryDocument = {
      authorizationEndpoint: `https://login.microsoftonline.com/${config.microsoftTenantId}/oauth2/v2.0/authorize`,
      tokenEndpoint: `https://login.microsoftonline.com/${config.microsoftTenantId}/oauth2/v2.0/token`,
    };

    try {
      setState({ loading: true, error: null });

      const request = new AuthRequest({
        clientId: config.microsoftClientId,
        redirectUri,
        scopes: ["openid", "profile", "email"],
        responseType: ResponseType.Code,
        usePKCE: true,
      });

      const result = await request.promptAsync(microsoftDiscovery);

      if (result.type === "success" && result.params?.code) {
        const tokenResponse = await fetch(microsoftDiscovery.tokenEndpoint!, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: config.microsoftClientId,
            code: result.params.code,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
            code_verifier: request.codeVerifier || "",
          }).toString(),
        });
        const tokens = await tokenResponse.json();

        if (tokens.access_token) {
          const provider = new OAuthProvider("microsoft.com");
          const credential = provider.credential({
            idToken: tokens.id_token,
            accessToken: tokens.access_token,
          });
          await firebaseAuth.signInWithCredential(credential);
          setState({ loading: false, error: null });
        } else {
          setState({
            loading: false,
            error:
              tokens.error_description || "Microsoft token exchange failed",
          });
        }
      } else if (result.type === "error") {
        setState({
          loading: false,
          error: result.params?.error_description || "Microsoft sign-in failed",
        });
      } else {
        setState({ loading: false, error: null });
      }
    } catch (err: any) {
      setState({
        loading: false,
        error: err.message || "Microsoft sign-in failed",
      });
    }
  }, []);

  return { ...state, signInWithMicrosoft };
}
