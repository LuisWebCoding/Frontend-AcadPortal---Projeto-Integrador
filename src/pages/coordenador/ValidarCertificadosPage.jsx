import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, FileText, X, Loader2, Search, ExternalLink } from "lucide-react";
import { listarFilaValidacao, validarCertificado } from "@/services/certificado.service";
import api from "@/services/api";
import toast from "react-hot-toast";

const STATUS = {
  APROVADO:  { label: "Aprovado",  className: "bg-green-100 text-green-700"  },
  RECUSADO:  { label: "Recusado",  className: "bg-red-100 text-red-700"      },
  REPROVADO: { label: "Reprovado", className: "bg-red-100 text-red-700"      },
};

const getStatus = (s) =>
  s ? (STATUS[s] ?? { label: s, className: "bg-slate-100 text-slate-600" })
    : { label: "Pendente", className: "bg-amber-100 text-amber-700" };

function normalizarCertificado(c) {
  return {
    id:                    c.id,
    validacaoId:           c.validacao?.id ?? null,
    tituloAtividade:       c.tituloAtividade,
    cargaHorariaInformada: c.cargaHorariaInformada,
    arquivoImagem:         c.arquivoImagem ?? null,
    dataEnvio:             c.dataEnvio
      ? new Date(c.dataEnvio).toLocaleDateString("pt-BR")
      : "—",
    nomeAluno:             c.nomeAluno ?? c.aluno?.nome ?? "—",
    nomeArea:              c.nomeArea  ?? c.area?.nome  ?? "—",
    statusValidacao:       c.statusValidacao ?? c.validacao?.status ?? null,
    observacao:            c.observacao      ?? c.validacao?.observacao ?? null,
  };
}

export function ValidarCertificadosPage() {
  const [pendentes,      setPendentes]      = useState([]);
  const [historico,      setHistorico]      = useState([]);
  const [carregando,     setCarregando]     = useState(true);
  const [modal,          setModal]          = useState(null);
  const [horas,          setHoras]          = useState("");
  const [obs,            setObs]            = useState("");
  const [loading,        setLoading]        = useState(false);
  const [aprovados,      setAprovados]      = useState(0);
  const [recusados,      setRecusados]      = useState(0);
  const [matricula,      setMatricula]      = useState("");
  const [alunoResult,    setAlunoResult]    = useState(null);
  const [buscando,       setBuscando]       = useState(false);
  const [erroMatricula,  setErroMatricula]  = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await listarFilaValidacao();
        const lista = Array.isArray(dados.lista) ? dados.lista : [];
        setPendentes(lista.map(normalizarCertificado));
        setAprovados(dados.cards?.aprovados ?? 0);
        setRecusados(dados.cards?.recusados ?? 0);
      } catch {
        toast.error("Erro ao carregar certificados pendentes.");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  function abrirModal(tipo, cert) { setModal({ tipo, cert }); setHoras(""); setObs(""); }
  function fecharModal()          { setModal(null); }

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
    setLoading(true);
    try {
      if (modal.tipo === "aprovar") {
        await validarCertificado(modal.cert.validacaoId, "APROVADO", Number(horas), obs);
        const aprovado = { ...modal.cert, statusValidacao: "APROVADO", observacao: obs || null };
        setPendentes(prev => prev.filter(c => c.id !== modal.cert.id));
        setHistorico(prev => [aprovado, ...prev]);
        setAprovados(prev => prev + 1);
        toast.success("Certificado aprovado!");
      } else {
        await validarCertificado(modal.cert.validacaoId, "RECUSADO", 0, obs);
        const recusado = { ...modal.cert, statusValidacao: "RECUSADO", observacao: obs };
        setPendentes(prev => prev.filter(c => c.id !== modal.cert.id));
        setHistorico(prev => [recusado, ...prev]);
        setRecusados(prev => prev + 1);
        toast.success("Certificado reprovado.");
      }
      fecharModal();
    } catch {
      toast.error("Erro ao processar. Tente novamente.");
    }
    setLoading(false);
  }

  const canConfirm = modal && !loading &&
    (modal.tipo === "aprovar" ? !!horas : !!obs);

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

      {/* Buscar Situação */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Buscar Situação</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={matricula}
            onChange={e => setMatricula(e.target.value)}
            onKeyDown={e => e.key === "Enter" && buscarAluno()}
            placeholder="Digite a matrícula do aluno"
            className="flex-1 h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent"
          />
          <button onClick={buscarAluno} disabled={buscando}
            className="px-4 py-2 bg-[#004587] hover:bg-[#003566] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
            {buscando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Buscar Aluno
          </button>
        </div>

        {erroMatricula && <p className="text-sm text-red-500 mt-3">{erroMatricula}</p>}

        {alunoResult && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#004587] font-bold text-sm">
                {alunoResult.nome?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{alunoResult.nome}</p>
                <p className="text-xs text-slate-400">{alunoResult.email} · Matrícula: {alunoResult.matricula}</p>
              </div>
            </div>
            {alunoResult.certificados?.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhum certificado enviado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-50">
                      {["Título", "Área", "Horas", "Status", "Observação"].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-medium text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {alunoResult.certificados.map(cert => {
                      const s = getStatus(cert.validacao?.status);
                      return (
                        <tr key={cert.id} className="hover:bg-slate-50">
                          <td className="px-3 py-3 font-medium text-slate-700">{cert.tituloAtividade}</td>
                          <td className="px-3 py-3 text-slate-500">{cert.area?.nome ?? "—"}</td>
                          <td className="px-3 py-3 text-slate-700">{cert.cargaHorariaInformada}h</td>
                          <td className="px-3 py-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.className}`}>{s.label}</span>
                          </td>
                          <td className="px-3 py-3 text-slate-400 text-xs">{cert.validacao?.observacao ?? "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pendentes", valor: pendentes.length, icon: Clock,       iconCls: "text-amber-600", bgCls: "bg-amber-50" },
          { label: "Aprovados", valor: aprovados,        icon: CheckCircle, iconCls: "text-green-600", bgCls: "bg-green-50" },
          { label: "Recusados", valor: recusados,        icon: XCircle,     iconCls: "text-red-500",   bgCls: "bg-red-50"  },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${c.bgCls} flex items-center justify-center shrink-0`}>
              <c.icon className={`h-5 w-5 ${c.iconCls}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className={`text-2xl font-bold ${c.iconCls}`}>{c.valor}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Certificados pendentes */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 p-5 border-b border-slate-50">
          <Clock className="h-4 w-4 text-amber-500" />
          <h2 className="text-base font-semibold text-slate-800">
            Certificados Pendentes ({pendentes.length})
          </h2>
        </div>

        {pendentes.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-300" />
            Nenhum certificado pendente. Tudo em dia!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50">
                  {["Aluno", "Título", "Área", "Data de Envio", "Horas", "Ações"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendentes.map(cert => (
                  <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-700">{cert.nomeAluno}</td>
                    <td className="px-5 py-4 text-slate-600 max-w-50 truncate">{cert.tituloAtividade}</td>
                    <td className="px-5 py-4 text-slate-500">{cert.nomeArea}</td>
                    <td className="px-5 py-4 text-slate-500">{cert.dataEnvio}</td>
                    <td className="px-5 py-4 font-medium text-slate-700">{cert.cargaHorariaInformada}h</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* AQUI: Botão substituído por Tag A para corrigir o CORS */}
                        {cert.arquivoImagem && (
                          <a
                            href={cert.arquivoImagem}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Ver
                          </a>
                        )}
                        <button onClick={() => abrirModal("aprovar", cert)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                          <CheckCircle className="h-3.5 w-3.5" /> Aprovar
                        </button>
                        <button onClick={() => abrirModal("reprovar", cert)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">
                          <XCircle className="h-3.5 w-3.5" /> Reprovar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Histórico */}
      {historico.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 p-5 border-b border-slate-50">
            <FileText className="h-4 w-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-800">Validados nesta sessão ({historico.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50">
                  {["Aluno", "Título", "Área", "Status", "Observação"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {historico.map(cert => {
                  const s = getStatus(cert.statusValidacao);
                  return (
                    <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-700">{cert.nomeAluno}</td>
                      <td className="px-5 py-4 text-slate-600 max-w-50 truncate">{cert.tituloAtividade}</td>
                      <td className="px-5 py-4 text-slate-500">{cert.nomeArea}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.className}`}>{s.label}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs">{cert.observacao ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Modal de Aprovar / Reprovar */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={fecharModal}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${modal.tipo === "aprovar" ? "bg-green-100" : "bg-red-100"}`}>
                    {modal.tipo === "aprovar"
                      ? <CheckCircle className="h-5 w-5 text-green-600" />
                      : <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">
                      {modal.tipo === "aprovar" ? "Aprovar Certificado" : "Reprovar Certificado"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {modal.cert.tituloAtividade} — {modal.cert.nomeAluno}
                    </p>
                  </div>
                </div>
                <button onClick={fecharModal} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* AQUI: Botão do modal substituído por Tag A */}
              {modal.cert.arquivoImagem && (
                <a
                  href={modal.cert.arquivoImagem}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 mb-4 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#004587] font-medium hover:bg-blue-50 transition-colors w-full"
                >
                  <ExternalLink className="h-4 w-4" /> Ver certificado
                </a>
              )}

              <div className="space-y-4">
                {modal.tipo === "aprovar" && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">
                      Horas validadas <span className="text-red-500">*</span>
                    </label>
                    <input type="number" min="1" max={modal.cert.cargaHorariaInformada}
                      value={horas} onChange={e => setHoras(e.target.value)}
                      placeholder={`Máx: ${modal.cert.cargaHorariaInformada}h`}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent" />
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">
                    Observação {modal.tipo === "reprovar"
                      ? <span className="text-red-500">*</span>
                      : <span className="text-slate-400">(opcional)</span>}
                  </label>
                  <textarea value={obs} onChange={e => setObs(e.target.value)} rows={3}
                    placeholder={modal.tipo === "reprovar" ? "Informe o motivo da reprovação..." : "Comentário opcional..."}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent resize-none" />
                </div>

                <div className="flex gap-3 pt-1">
                  <button onClick={fecharModal}
                    className="flex-1 h-10 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    Cancelar
                  </button>
                  <button onClick={confirmar} disabled={!canConfirm}
                    className={`flex-1 h-10 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      modal.tipo === "aprovar" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                    }`}>
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Processando...</> : "Confirmar"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}