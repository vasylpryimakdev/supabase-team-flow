import { useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { Spinner } from "./Spinner";

const authRoutes = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];

export function RouteResolver({ children }: { children: React.ReactNode }) {
  const { user, team, status, isRecovery } = useAuthStore();
  const { pathname } = useLocation();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

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

  if (team === undefined)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );

  if (!team) {
    if (pathname !== "/onboarding") {
      return <Navigate to="/onboarding" replace />;
    }
    return children;
  }

  if (team && pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
