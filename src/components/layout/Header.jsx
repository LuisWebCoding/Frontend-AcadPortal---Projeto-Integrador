import { useAuth } from '@/hooks/useAuth';
import { Bell } from 'lucide-react';

export function Header({ titulo, subtitulo }) {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50">
      <div>
        {titulo && (
          <h1 className="text-lg font-semibold text-slate-800 leading-tight">
            {titulo}
          </h1>
        )}
        {subtitulo && (
          <p className="text-xs text-slate-500">{subtitulo}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-1.5 text-slate-400 hover:text-[#004587] hover:bg-blue-50 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-3.5 h-3.5 text-[9px] flex items-center justify-center font-bold">
            2
          </span>
        </button>
        
        <div className="h-8 w-px bg-slate-100 mx-1" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">
              {user?.nome ?? 'Usuário'}
            </p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {user?.perfil ?? 'Perfil'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#004587] flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-blue-50">
            {user?.nome?.[0] ?? 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}