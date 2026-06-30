import { useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { Spinner } from "./Spinner";

const authRoutes = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];

export function RouteResolver({ children }: { children: React.ReactNode }) {
  const { user, team, status, isRecovery } = useAuthStore();
  const { pathname } = useLocation();

  if (status === "loading") return <Spinner />;

  if (isRecovery) {
    if (pathname === "/reset-password") return children;
    return <Navigate to="/reset-password" replace />;
  }

  if (!user) {
    if (!authRoutes.includes(pathname)) {
      return <Navigate to="/auth/signin" replace />;
    }
    
    return children;
  }

  if (team === undefined) return <Spinner />;

  if (!team) {
    if (pathname !== "/onboarding") {
      return <Navigate to="/onboarding" replace />;
    }
    return children;
  }

  if (authRoutes.includes(pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
