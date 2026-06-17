
export function PageLayout({ children, sidebar }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f5f5f5',
    }}>
      {sidebar}
      <main style={{
        marginLeft: 190,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  );
}