import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage";
import { Dashboard } from "../components/Dashboard";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
