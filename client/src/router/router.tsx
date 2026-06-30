import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import OnboardingPage from "../pages/OnboardingPage";
import NotFoundPage from "../pages/NotFoundPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import Dashboard from "../components/custom/Dashboard";
import { ProtectedRoute } from "../components/custom/ProtectedRoute";
import { RouteResolver } from "../components/custom/RouteResolver";
import { ErrorBoundary } from "../components/custom/ErrorBoundary";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";

export function Router() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <RouteResolver>
          <Routes>
            <Route path="/auth" element={<Outlet />}>
              <Route path="signin" element={<SignInPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
            </Route>
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
