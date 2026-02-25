export type Environment = "development" | "staging" | "production";

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export type AppConfig = {
  environment: Environment;
  apiUrl: string;
  firebase: FirebaseConfig;
};
