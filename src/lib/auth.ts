import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUp = async (email: string, password: string, displayName: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) await updateProfile(cred.user, { displayName });
  return cred.user;
};

export const logout = () => signOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
export const watchAuth = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb);
