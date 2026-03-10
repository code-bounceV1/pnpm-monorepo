import { firebaseAuth } from "./firebase";
import type { AuthUser } from "./types";

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthUser> {
  const credential = await firebaseAuth.signInWithEmailAndPassword(
    email,
    password,
  );
  return credential.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<AuthUser> {
  const credential = await firebaseAuth.createUserWithEmailAndPassword(
    email,
    password,
  );
  return credential.user;
}

export async function signOut(): Promise<void> {
  await firebaseAuth.signOut();
}

export async function resetPassword(email: string): Promise<void> {
  await firebaseAuth.sendPasswordResetEmail(email);
}
