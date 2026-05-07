import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, CheckCircle, FileText, ChevronRight, Info, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { listarMeusCertificados } from "@/services/certificado.service";
import api from "@/services/api";
import toast from "react-hot-toast";

export function AlunoDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard]   = useState(null);
  const [recentes, setRecentes]     = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [dash, certsRes] = await Promise.all([
          api.get("/api/dashboard").then(r => r.data),
          listarMeusCertificados(),
        ]);
        setDashboard(dash);
        const lista = Array.isArray(certsRes) ? certsRes : (certsRes?.certificados ?? []);
        setRecentes(lista.slice(0, 3));
      } catch {
        toast.error("Erro ao carregar dashboard.");
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  const totalExigido   = dashboard?.totalExigido   ?? 200;
  const horasConcluidas = dashboard?.horasConcluidas ?? 0;
  const horasFaltantes  = Math.max(0, totalExigido - horasConcluidas);
  const pct = Math.min(100, Math.round((horasConcluidas / totalExigido) * 200));
  const distribuicao = dashboard?.distribuicaoPorAtividade ?? [];

  const primeiroNome = user?.nome?.split(" ")[0] ?? "Aluno";

  const getStatusChip = (validacao) => {
    const s = validacao?.status ?? null;
    if (s === "APROVADO")  return { label: "Aprovado",  className: "bg-green-100 text-green-700" };
    if (s === "RECUSADO")  return { label: "Recusado",  className: "bg-red-100 text-red-700" };
    return { label: "Pendente", className: "bg-amber-100 text-amber-700" };
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Carregando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Olá, {primeiroNome}! 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Acompanhe seu progresso em horas complementares.</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Clock, bg: "bg-blue-50", cls: "text-[#004587]",
            label: "Horas Concluídas", valor: `${horasConcluidas}h`, sub: `de ${totalExigido}h`,
          },
          {
            icon: TrendingUp, bg: "bg-amber-50", cls: "text-amber-600",
            label: "Horas Faltantes", valor: `${horasFaltantes}h`, sub: "para concluir",
          },
          {
            icon: CheckCircle, bg: "bg-green-50", cls: "text-green-600",
            label: "Status",
            valor: pct >= 100 ? "Concluído! 🎉" : "Em andamento",
            sub: pct >= 100 ? "Meta atingida" : "Conclusão em andamento",
            valorCls: pct >= 100 ? "text-green-600 text-lg" : "text-slate-700 text-lg",
          },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center`}>
                <c.icon className={`h-5 w-5 ${c.cls}`} />
              </div>
              <span className="text-sm text-slate-500 font-medium">{c.label}</span>
            </div>
            <p className={`font-bold ${c.valorCls ?? `text-3xl ${c.cls}`}`}>{c.valor}</p>
            <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Progresso + Distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Progresso circular */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Seu Progresso</h2>
          <div className="flex items-center gap-8">
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#004587" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#004587]">{pct}%</span>
                <span className="text-xs text-slate-400">do total</span>
              </div>
            </div>
            <div className="space-y-2 text-sm flex-1">
              {[
                { label: "Total exigido",    valor: `${totalExigido}h`,    cls: "text-slate-700" },
                { label: "Horas concluídas", valor: `${horasConcluidas}h`, cls: "text-[#004587] font-semibold" },
                { label: "Horas faltantes",  valor: `${horasFaltantes}h`,  cls: "text-amber-600 font-semibold" },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-slate-500">{r.label}</span>
                  <span className={r.cls}>{r.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Distribuição por atividade */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Distribuição por Atividade</h2>
          {distribuicao.length === 0 ? (
            <p className="text-slate-400 text-sm">Nenhuma hora aprovada ainda.</p>
          ) : (
            <div className="space-y-3">
              {distribuicao.map(({ area, horas }) => (
                <div key={area}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 truncate">{area}</span>
                    <span className="text-slate-800 font-semibold ml-2">{horas}h</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full">
                    <div className="h-full bg-[#004587] rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (horas / horasConcluidas) * 100)}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-400 pt-1">Total {horasConcluidas}h</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Atividades recentes */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-slate-50">
          <h2 className="text-base font-semibold text-slate-800">Atividades Recentes</h2>
          <button onClick={() => navigate("/aluno/horas")}
            className="text-sm text-[#004587] hover:underline font-medium">
            Ver todas as atividades
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {recentes.length === 0 ? (
            <p className="p-5 text-sm text-slate-400">Nenhuma atividade enviada ainda.</p>
          ) : recentes.map(cert => {
            const s = getStatusChip(cert.validacao);
            const dataEnvio = cert.dataEnvio
              ? new Date(cert.dataEnvio).toLocaleDateString("pt-BR")
              : "—";
            return (
              <div key={cert.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-[#004587]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{cert.tituloAtividade}</p>
                  <p className="text-xs text-slate-400">{cert.area?.nome ?? "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.className}`}>{s.label}</span>
                  <span className="text-xs text-slate-400">{cert.cargaHorariaInformada}h</span>
                  <span className="text-xs text-slate-400">{dataEnvio}</span>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="bg-blue-50 rounded-xl p-4 flex gap-3 border border-blue-100">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">Sobre as Horas Complementares</p>
          <p className="text-xs text-blue-600 mt-1">
            As Horas Complementares são atividades acadêmicas, sociais ou profissionais que enriquecem sua formação.
            <button onClick={() => navigate("/aluno/horas")} className="ml-1 underline font-medium">Saiba mais</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}