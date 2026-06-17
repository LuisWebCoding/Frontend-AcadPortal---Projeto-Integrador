import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, ChevronLeft, LogOut, ArrowLeftRight } from 'lucide-react';
import logoSenac from '@/assets/logo-senac.png';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar({ items, switchLabel, switchTo }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={`bg-[#004587] h-screen flex flex-col fixed left-0 top-0 z-[100] transition-all duration-300 overflow-x-hidden shadow-2xl ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`p-5 border-b border-white/10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <img src={logoSenac} alt="SENAC" className="h-8 brightness-0 invert" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-none">AcadPortal</span>
              <span className="text-blue-200 text-[10px] uppercase font-bold tracking-tighter mt-1">Complementares</span>
            </div>
          </div>
        )}
        
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center shadow-inner"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            title={isCollapsed ? item.label : ''}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-white/15 text-white font-semibold shadow-lg shadow-black/5 ring-1 ring-white/10' 
                : 'text-blue-100 hover:bg-white/5 hover:text-white'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <item.icon size={22} className={`${isCollapsed ? '' : 'shrink-0'}`} />
            {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <NavLink
          to={switchTo}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-white/5 hover:text-white transition-all text-xs font-medium ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <ArrowLeftRight size={18} />
          {!isCollapsed && <span className="truncate">{switchLabel}</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-200 hover:bg-red-500/10 hover:text-red-100 transition-all text-xs font-medium ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Sair do sistema</span>}
        </button>
      </div>
    </aside>
  );
}