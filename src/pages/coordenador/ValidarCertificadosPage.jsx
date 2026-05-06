import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Clock, CheckCircle, XCircle, FileText, X, Loader2 } from "lucide-react";
import { mockTodosCertificados } from "@/services/mock";
import { aprovarCertificado, reprovarCertificado } from "@/services/validacao.service";
import toast from "react-hot-toast";

const STATUS = {
  APROVADO:  { label: "Aprovado",  className: "bg-green-100 text-green-700"  },
  REPROVADO: { label: "Reprovado", className: "bg-red-100 text-red-700"      },
};
const getStatus = (s) =>
  s ? (STATUS[s] ?? { label: s, className: "bg-slate-100 text-slate-600" })
    : { label: "Pendente", className: "bg-amber-100 text-amber-700" };

export function ValidarCertificadosPage() {
  const [certificados, setCertificados] = useState(mockTodosCertificados);
  const [modal, setModal]     = useState(null); // { tipo: 'aprovar'|'reprovar', cert }
  const [horas, setHoras]     = useState("");
  const [obs, setObs]         = useState("");
  const [loading, setLoading] = useState(false);

  const pendentes = certificados.filter(c => !c.statusValidacao);
  const historico = certificados.filter(c =>  c.statusValidacao);

  function abrirModal(tipo, cert) { setModal({ tipo, cert }); setHoras(""); setObs(""); }
  function fecharModal() { setModal(null); }

  async function confirmar() {
    setLoading(true);
    try {
      if (modal.tipo === "aprovar") {
        await aprovarCertificado(modal.cert.id, Number(horas), obs);
        setCertificados(prev =>
          prev.map(c => c.id === modal.cert.id ? { ...c, statusValidacao: "APROVADO", observacao: obs } : c)
        );
        toast.success("Certificado aprovado!");
      } else {
        await reprovarCertificado(modal.cert.id, obs);
        setCertificados(prev =>
          prev.map(c => c.id === modal.cert.id ? { ...c, statusValidacao: "REPROVADO", observacao: obs } : c)
        );
        toast.success("Certificado reprovado.");
      }
      fecharModal();
    } catch {
      toast.error("Erro ao processar.");
    }
    setLoading(false);
  }

  const canConfirm = modal && !loading &&
    (modal.tipo === "aprovar" ? !!horas : !!obs);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Validar Certificados</h1>
        <p className="text-slate-500 text-sm mt-1">Revise e valide os certificados enviados pelos alunos.</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pendentes",  valor: pendentes.length,  icon: Clock,        iconCls: "text-amber-600", bgCls: "bg-amber-50"  },
          { label: "Aprovados",  valor: historico.filter(c => c.statusValidacao === "APROVADO").length,  icon: CheckCircle, iconCls: "text-green-600", bgCls: "bg-green-50" },
          { label: "Reprovados", valor: historico.filter(c => c.statusValidacao === "REPROVADO").length, icon: XCircle,     iconCls: "text-red-500",   bgCls: "bg-red-50"   },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center gap-4"
          >
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm"
      >
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
                    <td className="px-5 py-4 text-slate-600 max-w-[200px] truncate">{cert.tituloAtividade}</td>
                    <td className="px-5 py-4 text-slate-500">{cert.nomeArea}</td>
                    <td className="px-5 py-4 text-slate-500">{cert.dataEnvio}</td>
                    <td className="px-5 py-4 font-medium text-slate-700">{cert.cargaHorariaInformada}h</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => abrirModal("aprovar", cert)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Aprovar
                        </button>
                        <button
                          onClick={() => abrirModal("reprovar", cert)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm"
      >
        <div className="flex items-center gap-2 p-5 border-b border-slate-50">
          <FileText className="h-4 w-4 text-slate-400" />
          <h2 className="text-base font-semibold text-slate-800">Histórico ({historico.length})</h2>
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
                    <td className="px-5 py-4 text-slate-600 max-w-[200px] truncate">{cert.tituloAtividade}</td>
                    <td className="px-5 py-4 text-slate-500">{cert.nomeArea}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.className}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{cert.observacao ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={fecharModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              {/* Header do modal */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    modal.tipo === "aprovar" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {modal.tipo === "aprovar"
                      ? <CheckCircle className="h-5 w-5 text-green-600" />
                      : <XCircle    className="h-5 w-5 text-red-500"   />
                    }
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

              <div className="space-y-4">
                {modal.tipo === "aprovar" && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">
                      Horas validadas <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={horas}
                      onChange={e => setHoras(e.target.value)}
                      placeholder={`Máx: ${modal.cert.cargaHorariaInformada}h`}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">
                    Observação {modal.tipo === "reprovar"
                      ? <span className="text-red-500">*</span>
                      : <span className="text-slate-400">(opcional)</span>
                    }
                  </label>
                  <textarea
                    value={obs}
                    onChange={e => setObs(e.target.value)}
                    rows={3}
                    placeholder={modal.tipo === "reprovar"
                      ? "Informe o motivo da reprovação..."
                      : "Comentário opcional..."
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={fecharModal}
                    className="flex-1 h-10 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmar}
                    disabled={!canConfirm}
                    className={`flex-1 h-10 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      modal.tipo === "aprovar"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {loading
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Processando...</>
                      : "Confirmar"
                    }
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
