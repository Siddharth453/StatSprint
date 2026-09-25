// src/components/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../../pages/LandingPage";
import LoginPage from "../../pages/LoginPage";
import { DashboardLayout } from "../layouts/DashboardLayout";
import DashboardPage from "../../pages/DashboardPage";
import { defaultTheme } from "../theme/theme";
import NotFoundPage from "../../pages/NotFoundPage";
import DeploymentsPage from "../../pages/DeploymentPage";
import SettingsPage from "../../pages/SettingsPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("authToken");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("authToken");
  return token ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export function AppRoutes() {
  const currentTheme = defaultTheme;

  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<LandingPage themeColor={currentTheme} />} />

      {/* Guest only */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage themeColor={currentTheme} />
          </PublicOnlyRoute>
        }
      />

      {/* Protected dashboard shell */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout themeColor={currentTheme} title="Cresco Portal" />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/deployments" element={<DeploymentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage themeColor={currentTheme} />} />
    </Routes>
  );
}

export default AppRoutes;
