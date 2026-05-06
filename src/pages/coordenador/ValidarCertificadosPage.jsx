import { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { mockTodosCertificados } from '../../services/mock';
import { aprovarCertificado, reprovarCertificado } from '../../services/validacao.service';
import toast from 'react-hot-toast';

const statusConfig = {
  APROVADO:  { label: 'Aprovado',  bg: '#E1F5EE', color: '#085041' },
  REPROVADO: { label: 'Reprovado', bg: '#FEECEC', color: '#7F1D1D' },
};
function getStatus(s) {
  if (!s) return { label: 'Pendente', bg: '#FEF3C7', color: '#92400E' };
  return statusConfig[s] ?? { label: s, bg: '#f3f4f6', color: '#374151' };
}

export function ValidarCertificadosPage() {
  const [certificados, setCertificados] = useState(mockTodosCertificados);
  const [modal, setModal]   = useState(null);
  const [horas, setHoras]   = useState('');
  const [obs, setObs]       = useState('');
  const [loading, setLoading] = useState(false);

  const pendentes = certificados.filter(c => !c.statusValidacao);
  const historico = certificados.filter(c =>  c.statusValidacao);

  function abrirModal(tipo, cert) { setModal({ tipo, cert }); setHoras(''); setObs(''); }
  function fecharModal() { setModal(null); }

  async function confirmar() {
    setLoading(true);
    try {
      if (modal.tipo === 'aprovar') {
        await aprovarCertificado(modal.cert.id, Number(horas), obs);
        setCertificados(prev => prev.map(c => c.id === modal.cert.id ? { ...c, statusValidacao: 'APROVADO', observacao: obs } : c));
        toast.success('Certificado aprovado!');
      } else {
        await reprovarCertificado(modal.cert.id, obs);
        setCertificados(prev => prev.map(c => c.id === modal.cert.id ? { ...c, statusValidacao: 'REPROVADO', observacao: obs } : c));
        toast.success('Certificado reprovado.');
      }
      fecharModal();
    } catch { toast.error('Erro ao processar.'); }
    setLoading(false);
  }

  const tdStyle = { padding: 12 };
  const thStyle = { padding: '8px 12px', textAlign: 'left', color: '#6b7280', fontWeight: 500 };

  return (
    <div>
      <Header titulo="Validar Certificados" subtitulo="Revise e valide os certificados enviados pelos alunos." />
      <div style={{ padding: '32px 40px' }}>

        {/* Pendentes */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Certificados Pendentes ({pendentes.length})</h2>
          {pendentes.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 14 }}>Nenhum certificado pendente.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  {['Aluno', 'Titulo', 'Area', 'Data Envio', 'Horas', 'Acoes'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {pendentes.map(cert => (
                  <tr key={cert.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={tdStyle}>{cert.nomeAluno}</td>
                    <td style={tdStyle}>{cert.tituloAtividade}</td>
                    <td style={{ ...tdStyle, color: '#6b7280' }}>{cert.nomeArea}</td>
                    <td style={{ ...tdStyle, color: '#6b7280' }}>{cert.dataEnvio}</td>
                    <td style={tdStyle}>{cert.cargaHorariaInformada}h</td>
                    <td style={{ ...tdStyle, display: 'flex', gap: 8 }}>
                      <button onClick={() => abrirModal('aprovar', cert)} style={{ padding: '6px 14px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>✓ Aprovar</button>
                      <button onClick={() => abrirModal('reprovar', cert)} style={{ padding: '6px 14px', background: '#D0021B', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>✕ Reprovar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Historico */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Historico</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                {['Aluno', 'Titulo', 'Area', 'Status', 'Observacao'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {historico.map(cert => {
                const s = getStatus(cert.statusValidacao);
                return (
                  <tr key={cert.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={tdStyle}>{cert.nomeAluno}</td>
                    <td style={tdStyle}>{cert.tituloAtividade}</td>
                    <td style={{ ...tdStyle, color: '#6b7280' }}>{cert.nomeArea}</td>
                    <td style={tdStyle}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td style={{ ...tdStyle, color: '#6b7280', fontSize: 12 }}>{cert.observacao ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>
              {modal.tipo === 'aprovar' ? '✓ Aprovar Certificado' : '✕ Reprovar Certificado'}
            </h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>{modal.cert.tituloAtividade} — {modal.cert.nomeAluno}</p>

            {modal.tipo === 'aprovar' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Horas validadas *</label>
                <input type="number" value={horas} onChange={e => setHoras(e.target.value)} placeholder={`Max: ${modal.cert.cargaHorariaInformada}h`}
                  style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14 }} />
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Observacao {modal.tipo === 'reprovar' ? '*' : '(opcional)'}</label>
              <textarea value={obs} onChange={e => setObs(e.target.value)} rows={3} placeholder={modal.tipo === 'reprovar' ? 'Motivo da reprovacao...' : 'Comentario opcional...'}
                style={{ width: '100%', padding: '9px 12px', boxSizing: 'border-box', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={fecharModal} style={{ padding: '9px 20px', background: '#f3f4f6', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={confirmar} disabled={loading || (modal.tipo === 'aprovar' && !horas) || (modal.tipo === 'reprovar' && !obs)}
                style={{ padding: '9px 20px', background: modal.tipo === 'aprovar' ? '#1D9E75' : '#D0021B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Processando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
