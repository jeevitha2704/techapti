import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { watchAuth } from "../lib/auth";
import { ensureUserDoc } from "../lib/firestore";

type AuthState = { user: User | null; loading: boolean; };
const AuthContext = createContext<AuthState>({ user: null, loading: true });
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const unsub = watchAuth(async (user) => {
      setState({ user, loading: false });
      if (user) await ensureUserDoc(user.uid, { email: user.email, displayName: user.displayName });
    });
    return () => unsub();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
