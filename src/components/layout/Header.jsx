import { useAuth } from '../../hooks/useAuth';

export function Header({ titulo, subtitulo }) {
  const { user } = useAuth();

  return (
    <header style={{
      height: 56,
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div>
        {titulo && (
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>
            {titulo}
          </h1>
        )}
        {subtitulo && (
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{subtitulo}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{
          background: 'none', border: 'none',
          cursor: 'pointer', position: 'relative', padding: 4,
        }}>
          <span style={{ fontSize: 18 }}>🔔</span>
          <span style={{
            position: 'absolute', top: 0, right: 0,
            background: '#D0021B', color: '#fff',
            borderRadius: '50%', width: 14, height: 14,
            fontSize: 9, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>2</span>
        </button>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>
          {user?.nome ?? 'Usuário'}
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#003D7A', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 13, fontWeight: 600,
        }}>
          {user?.nome?.[0] ?? 'U'}
        </div>
      </div>
    </header>
  );
}