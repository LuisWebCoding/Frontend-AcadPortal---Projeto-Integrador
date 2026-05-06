import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function RoleRoute({ roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10">Carregando...</div>;
  if (!user || !roles.includes(user.perfil)) return <Navigate to="/nao-autorizado" replace />;
  return <Outlet />;
}
