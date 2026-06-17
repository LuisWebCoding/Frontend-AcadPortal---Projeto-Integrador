import { useState } from "react";
import { Clock, CheckCircle, XCircle, FileText, Loader2, ExternalLink } from "lucide-react";
import { useFilaValidacao, useValidarCertificado } from "@/hooks/useCertificados";
import api from "@/services/api";
import toast from "react-hot-toast";

// Componentes Reutilizáveis
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CertificateTable } from "@/components/certificates/CertificateTable";
import { ValidationModal } from "@/components/certificates/ValidationModal";
import { StudentSearch } from "@/components/coordenador/StudentSearch";
import { Button } from "@/components/ui/Button";

function normalizarCertificado(c) {
  let urlCorrigida = c.arquivoImagem;
  if (urlCorrigida && urlCorrigida.includes('.storage.supabase.co')) {
    urlCorrigida = urlCorrigida.replace('.storage.supabase.co', '.supabase.co/storage/v1/object/public');
  }
  return {
    ...c,
    validacaoId:           c.validacao?.id ?? null,
    arquivoImagem:         urlCorrigida,
    dataEnvio:             c.dataEnvio ? new Date(c.dataEnvio).toLocaleDateString("pt-BR") : "—",
    nomeAluno:             c.nomeAluno ?? c.aluno?.nome ?? "—",
    nomeArea:              c.nomeArea  ?? c.area?.nome  ?? "—",
    statusValidacao:       c.statusValidacao ?? c.validacao?.status ?? null,
    observacao:            c.observacao      ?? c.validacao?.observacao ?? null,
  };
}

export function ValidarCertificadosPage() {
  const { data: filaData, isLoading: carregando } = useFilaValidacao();
  const mutationValidar = useValidarCertificado();

  const [historico,      setHistorico]      = useState([]);
  const [modal,          setModal]          = useState(null);
  const [horas,          setHoras]          = useState("");
  const [obs,            setObs]            = useState("");
  const [matricula,      setMatricula]      = useState("");
  const [alunoResult,    setAlunoResult]    = useState(null);
  const [buscando,       setBuscando]       = useState(false);
  const [erroMatricula,  setErroMatricula]  = useState(null);

  const pendentes = (filaData?.lista ?? []).map(normalizarCertificado);
  const aprovadosCount = filaData?.cards?.aprovados ?? 0;
  const recusadosCount = filaData?.cards?.recusados ?? 0;

  async function buscarAluno() {
    if (!matricula.trim()) return;
    setBuscando(true);
    setErroMatricula(null);
    setAlunoResult(null);
    try {
      const { data } = await api.get(`/api/validacao/aluno/${matricula.trim()}`);
      setAlunoResult(data);
    } catch (err) {
      setErroMatricula(err?.response?.data?.erro ?? "Aluno não encontrado.");
    } finally {
      setBuscando(false);
    }
  }

  async function confirmar() {
    try {
      const status = modal.tipo === "aprovar" ? "APROVADO" : "RECUSADO";
      await mutationValidar.mutateAsync({
        id: modal.cert.validacaoId,
        status,
        horas: Number(horas || 0),
        observacao: obs || null
      });
      
      const atualizado = { ...modal.cert, statusValidacao: status, observacao: obs || null };
      setHistorico(prev => [atualizado, ...prev]);
      setModal(null);
    } catch {
      // Erro já tratado no hook
    }
  }

  const columnsPendentes = [
    { label: "Aluno", key: "nomeAluno" },
    { label: "Título", key: "tituloAtividade", render: (c) => <div className="max-w-50 truncate">{c.tituloAtividade}</div> },
    { label: "Área", key: "nomeArea" },
    { label: "Data de Envio", key: "dataEnvio" },
    { label: "Horas", key: "cargaHorariaInformada", render: (c) => `${c.cargaHorariaInformada}h` },
  ];

  const columnsHistorico = [
    { label: "Aluno", key: "nomeAluno" },
    { label: "Título", key: "tituloAtividade", render: (c) => <div className="max-w-50 truncate">{c.tituloAtividade}</div> },
    { label: "Área", key: "nomeArea" },
    { label: "Status", key: "status" },
    { label: "Observação", key: "observacao", render: (c) => <span className="text-slate-400 text-xs">{c.observacao ?? "—"}</span> },
  ];

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Carregando certificados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Validar Certificados</h1>
        <p className="text-slate-500 text-sm mt-1">Revise e valide os certificados enviados pelos alunos.</p>
      </div>

      <StudentSearch 
        matricula={matricula}
        setMatricula={setMatricula}
        onSearch={buscarAluno}
        buscando={buscando}
        erro={erroMatricula}
        result={alunoResult}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Pendentes" valor={pendentes.length} icon={Clock} iconClassName="text-amber-600" bgClassName="bg-amber-50" delay={0} />
        <StatsCard label="Aprovados" valor={aprovadosCount} icon={CheckCircle} iconClassName="text-green-600" bgClassName="bg-green-50" delay={0.05} />
        <StatsCard label="Recusados" valor={recusadosCount} icon={XCircle} iconClassName="text-red-500" bgClassName="bg-red-50" delay={0.1} />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 p-5 border-b border-slate-50">
          <Clock className="h-4 w-4 text-amber-500" />
          <h2 className="text-base font-semibold text-slate-800">Certificados Pendentes ({pendentes.length})</h2>
        </div>
        <CertificateTable 
          certificates={pendentes}
          loading={false}
          columns={columnsPendentes}
          emptyMessage="Nenhum certificado pendente. Tudo em dia!"
          renderActions={(cert) => (
            <div className="flex items-center gap-2">
              {cert.arquivoImagem && (
                <a href={cert.arquivoImagem} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" /> Ver
                </a>
              )}
              <Button size="xs" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setModal({ tipo: "aprovar", cert }); setHoras(""); setObs(""); }}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Aprovar
              </Button>
              <Button size="xs" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => { setModal({ tipo: "reprovar", cert }); setHoras(""); setObs(""); }}>
                <XCircle className="h-3.5 w-3.5 mr-1" /> Reprovar
              </Button>
            </div>
          )}
        />
      </div>

      {historico.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 p-5 border-b border-slate-50">
            <FileText className="h-4 w-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-800">Validados nesta sessão ({historico.length})</h2>
          </div>
          <CertificateTable 
            certificates={historico}
            loading={false}
            columns={columnsHistorico}
          />
        </div>
      )}

      <ValidationModal 
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={confirmar}
        horas={horas}
        setHoras={setHoras}
        obs={obs}
        setObs={setObs}
        loading={mutationValidar.isPending}
      />
    </div>
  );
}