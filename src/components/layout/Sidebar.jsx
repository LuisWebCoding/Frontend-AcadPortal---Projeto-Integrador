// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Recebe um array de itens e o link "trocar perfil"
export function Sidebar({ items, switchLabel, switchTo }) {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--color-sidebar-bg)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0, top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img src="/logo-senac.svg" alt="SENAC" style={{ height: 32 }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>AcadPortal</p>
      </div>

      {/* Itens de navegação */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              color: isActive ? 'var(--color-sidebar-active)' : 'var(--color-sidebar-text)',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
              textDecoration: 'none',
              fontSize: 'var(--font-size-md)',
              transition: 'all .15s',
            })}
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Trocar perfil */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <NavLink
          to={switchTo}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'rgba(255,255,255,0.5)', fontSize: 12,
            textDecoration: 'none',
          }}
        >
          ↔ {switchLabel}
        </NavLink>
      </div>
    </aside>
  );
}