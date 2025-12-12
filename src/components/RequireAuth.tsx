// src/components/RequireAuth.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUserId } from "../utils/auth";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const id = getCurrentUserId();
  if (!id) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
