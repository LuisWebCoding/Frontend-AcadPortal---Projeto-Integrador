import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { AlunoLayout } from "@/pages/aluno/AlunoLayout";
import { AlunoDashboardPage } from "@/pages/aluno/AlunoDashboardPage";
import { HorasComplementaresPage } from "@/pages/aluno/HorasComplementaresPage";
import { CoordernadorLayout } from "@/pages/coordenador/CoordernadorLayout";
import { ValidarCertificadosPage } from "@/pages/coordenador/ValidarCertificadosPage";
import { DashboardMetricasPage } from "@/pages/coordenador/DashboardMetricasPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/nao-autorizado", element: <div className="p-10 text-slate-600">Sem permissão de acesso.</div> },

  // ALUNO
  {
    element: <PrivateRoute />,
    children: [{
      element: <RoleRoute roles={["ALUNO"]} />,
      children: [{
        element: <AlunoLayout />,
        children: [
          { path: "/aluno/dashboard",  element: <AlunoDashboardPage /> },
          { path: "/aluno/horas",      element: <HorasComplementaresPage /> },
        ],
      }],
    }],
  },

  // COORDENADOR
  {
    element: <PrivateRoute />,
    children: [{
      element: <RoleRoute roles={["COORDENADOR"]} />,
      children: [{
        element: <CoordernadorLayout />,
        children: [
          { path: "/coordenador/dashboard", element: <DashboardMetricasPage /> },
          { path: "/coordenador/validar",   element: <ValidarCertificadosPage /> },
        ],
      }],
    }],
  },

  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);