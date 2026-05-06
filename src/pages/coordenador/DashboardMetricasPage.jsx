import { Header } from '../../components/layout/Header';
import { mockDashboard } from '../../services/mock';

export function DashboardMetricasPage() {
  const d = mockDashboard;
  const maxHoras = Math.max(...d.distribuicaoPorArea.map(a => a.horas));

  return (
    <div>
      <Header titulo="Dashboard de Metricas" subtitulo="Visao geral das atividades complementares do seu curso." />
      <div style={{ padding: '32px 40px' }}>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total de Alunos',     valor: d.totalAlunos,           cor: '#003D7A', bg: '#E6F1FB' },
            { label: 'Pendentes',           valor: d.pendentes,             cor: '#BA7517', bg: '#FEF3C7' },
            { label: 'Aprovados',           valor: d.aprovados,             cor: '#1D9E75', bg: '#E1F5EE' },
            { label: 'Horas Totais Valid.', valor: `${d.horasTotaisValidadas}h`, cor: '#003D7A', bg: '#E6F1FB' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>{c.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: c.cor, margin: 0 }}>{c.valor}</p>
            </div>
          ))}
        </div>

        {/* Grafico de barras por area */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Distribuicao de Horas por Area</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {d.distribuicaoPorArea.map(item => (
              <div key={item.area}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#374151' }}>{item.area}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#003D7A' }}>{item.horas}h</span>
                </div>
                <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4 }}>
                  <div style={{ height: '100%', width: `${(item.horas / maxHoras) * 100}%`, background: '#003D7A', borderRadius: 4, transition: 'width .4s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
