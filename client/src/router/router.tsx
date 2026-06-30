import { BrowserRouter, Routes, Route } from "react-router-dom";

import OnboardingPage from "../pages/OnboardingPage";
import NotFoundPage from "../pages/NotFoundPage";
import AuthPage from "../pages/AuthPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import Dashboard from "../components/custom/Dashboard";
import { ProtectedRoute } from "../components/custom/ProtectedRoute";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { RouteResolver } from "../components/custom/RouteResolver";

export function Router() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <RouteResolver>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </RouteResolver>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
