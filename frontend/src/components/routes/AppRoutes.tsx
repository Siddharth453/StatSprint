import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../../pages/LandingPage";
import FootballPage from "../../pages/FootballPage";
import CricketPage from "../../pages/CricketPage";
import DashboardPage from "../../pages/DashboardPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/football/:matchId" element={<FootballPage />} />
      <Route path="/cricket/:matchId" element={<CricketPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/cricket" element={<CricketPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
