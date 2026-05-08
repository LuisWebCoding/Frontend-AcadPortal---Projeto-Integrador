import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FileText, LogOut, Bell, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoSenac from "@/assets/logo-senac.png";
import { useState } from "react";

const menu = [
  { to: "/aluno/dashboard", icon: LayoutDashboard, label: "Dashboard"            },
  { to: "/aluno/horas",     icon: FileText,        label: "Horas Complementares" },
];

export function AlunoLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropOpen,    setDropOpen]    = useState(false);
  const [menuMobile,  setMenuMobile]  = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const SidebarContent = ({ onClose }) => (
    <>
      <div className="p-6 border-b border-white/10">
        <img src={logoSenac} alt="Senac" className="h-8 brightness-0 invert" />
        <p className="text-white/50 text-xs mt-1">AcadPortal</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menu.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-[#004587]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white w-full transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar Desktop */}
      <aside className="w-55 bg-[#004587] flex-col fixed top-0 left-0 h-full z-50 hidden md:flex">
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* Overlay Mobile */}
      <AnimatePresence>
        {menuMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMenuMobile(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-60 bg-[#004587] z-50 flex flex-col md:hidden"
            >
              <div className="flex justify-end p-3">
                <button onClick={() => setMenuMobile(false)} className="p-1 rounded-lg hover:bg-white/10">
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <SidebarContent onClose={() => setMenuMobile(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-55 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 sticky top-0 z-40 gap-3">
          
          {/* Botão hambúrguer - só no mobile */}
          <button
            onClick={() => setMenuMobile(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors md:hidden"
          >
            <Menu className="h-5 w-5 text-slate-500" />
          </button>

          <div className="flex-1 md:hidden" />

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#004587] flex items-center justify-center text-white text-sm font-semibold">
                  {user?.nome?.[0] ?? "U"}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-slate-700 leading-none">{user?.nome}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Aluno</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}