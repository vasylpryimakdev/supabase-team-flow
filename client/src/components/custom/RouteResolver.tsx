import { useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { Spinner } from "./Spinner";
import { useTeamStore } from "../../stores/teamStore";

const authRoutes = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];

export function RouteResolver({ children }: { children: React.ReactNode }) {
  const { user, status, isRecovery } = useAuthStore();
  const team = useTeamStore((s) => s.team);
  const teamLoading = useTeamStore((s) => s.isLoading);
  const { pathname } = useLocation();

  if (status === "loading" || teamLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isRecovery) {
    return pathname === "/reset-password" ? (
      children
    ) : (
      <Navigate to="/reset-password" replace />
    );
  }

  if (!user) {
    const isAuthRoute = authRoutes.includes(pathname);
    return isAuthRoute ? children : <Navigate to="/auth/signin" replace />;
  }

  if (!team) {
    const isAllowed = pathname === "/onboarding";
    return isAllowed ? children : <Navigate to="/onboarding" replace />;
  }

  if (
    authRoutes.includes(pathname) ||
    pathname === "/onboarding" ||
    pathname.startsWith("/join")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
