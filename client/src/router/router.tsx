import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import OnboardingPage from "../pages/OnboardingPage";
import NotFoundPage from "../pages/NotFoundPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import { ProtectedRoute } from "../components/custom/ProtectedRoute";
import { RouteResolver } from "../components/custom/RouteResolver";
import { ErrorBoundary } from "../components/custom/ErrorBoundary";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import { DashboardLayout } from "../components/custom/dashboard/DashboardLayout";
import ProductsPage from "../pages/ProductsPage";
import MembersPage from "../pages/MembersPage";
import SettingsPage from "../pages/SettingsPage";
import { ProfilePage } from "../pages/ProfilePage";

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
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<ProductsPage />} />
                <Route path="members" element={<MembersPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </RouteResolver>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
