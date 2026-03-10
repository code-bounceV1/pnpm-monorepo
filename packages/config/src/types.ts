export type Environment = "development" | "staging" | "production";

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  googleWebClientId: string;
  googleAndroidClientId: string;
  microsoftClientId: string;
  microsoftTenantId: string;
  androidRedirectUri: string;
  googleAuthEndpoint: string;
  googleTokenEndpoint: string;
  googleRevocationEndpoint: string;
};

export type AppConfig = {
  environment: Environment;
  apiUrl: string;
  firebase: FirebaseConfig;
};
