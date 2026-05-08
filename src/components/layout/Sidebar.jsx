// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react'; // Assumindo Lucide, ajuste se necessário

export function Sidebar({ items, switchLabel, switchTo }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Definimos a largura baseada no estado
  const sidebarWidth = isCollapsed ? '80px' : 'var(--sidebar-width)';

  return (
    <aside style={{
      width: sidebarWidth,
      background: 'var(--color-sidebar-bg)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0, top: 0,
      zIndex: 100,
      transition: 'width 0.3s ease', // Transição suave ao abrir/fechar
      overflowX: 'hidden'
    }}>
      
      {/* Header com Logo e Botão Toggle */}
      <div style={{ 
        padding: '20px 16px 16px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between'
      }}>
        {!isCollapsed && (
          <div>
            <img src="/logo-senac.svg" alt="SENAC" style={{ height: 32 }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>AcadPortal</p>
          </div>
        )}
        
        <button 
          onClick={toggleSidebar}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Itens de navegação */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            title={isCollapsed ? item.label : ''} // Mostra tooltip se estiver fechado
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 20px',
              color: isActive ? 'var(--color-sidebar-active)' : 'var(--color-sidebar-text)',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
              textDecoration: 'none',
              fontSize: 'var(--font-size-md)',
              transition: 'all .15s',
              whiteSpace: 'nowrap' // Impede o texto de quebrar linha
            })}
          >
            <item.icon size={20} style={{ minWidth: 20 }} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Trocar perfil */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <NavLink
          to={switchTo}
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            color: 'rgba(255,255,255,0.5)', 
            fontSize: 12,
            textDecoration: 'none',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
        >
          <span style={{ fontSize: 18 }}>↔</span>
          {!isCollapsed && <span>{switchLabel}</span>}
        </NavLink>
      </div>
    </aside>
  );
}