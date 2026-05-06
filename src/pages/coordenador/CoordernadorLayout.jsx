// src/pages/coordenador/CoordernadorLayout.jsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { PageLayout } from '../../components/layout/PageLayout';

const menuCoordenador = [
  { to: '/coordenador/validar',   icon: '✅', label: 'Validar Certificados' },
  { to: '/coordenador/dashboard', icon: '📊', label: 'Dashboard'            },
];

export function CoordernadorLayout() {
  return (
    <PageLayout sidebar={<Sidebar items={menuCoordenador} switchLabel="Trocar para Aluno" switchTo="/aluno/horas" />}>
      <Outlet />
    </PageLayout>
  );
}
