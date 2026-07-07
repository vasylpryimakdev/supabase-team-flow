import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";

import { DashboardLayout } from "../components/custom/dashboard/DashboardLayout";
import { ErrorBoundary } from "../components/custom/common/ErrorBoundary";
import { ProtectedRoute } from "../components/custom/common/ProtectedRoute";
import { RouteResolver } from "../components/custom/common/RouteResolver";
import { Spinner } from "../components/custom/common/Spinner";

const OnboardingPage = lazy(() => import("../pages/OnboardingPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const SignInPage = lazy(() => import("../pages/SignInPage"));
const SignUpPage = lazy(() => import("../pages/SignUpPage"));

const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const MembersPage = lazy(() => import("../pages/MembersPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));

const ProfilePage = lazy(() =>
  import("../pages/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  })),
);

export function Router() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <RouteResolver>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/auth" element={<Outlet />}>
                <Route path="signin" element={<SignInPage />} />
                <Route path="signup" element={<SignUpPage />} />
                <Route
                  path="forgot-password"
                  element={<ForgotPasswordPage />}
                />
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
          </Suspense>
        </RouteResolver>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
