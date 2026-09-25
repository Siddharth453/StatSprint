import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../../pages/LandingPage";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { defaultTheme } from "../themes/theme";
import DashboardPage from "../../pages/DashboardPage";

export function AppRoutes() {
  const currentTheme = defaultTheme;

  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* <Route path="*" element={<NotFoundPage themeColor={currentTheme} />} /> */}
    </Routes>
  );
}

export default AppRoutes;
