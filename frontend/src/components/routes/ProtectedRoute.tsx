import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  redirectPath?: string;
}

export function ProtectedRoute({
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
