import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}