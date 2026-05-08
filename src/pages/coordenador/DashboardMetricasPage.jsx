import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Clock, CheckCircle, XCircle, BarChart2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { listarFilaValidacao } from "@/services/certificado.service";
import api from "@/services/api";
import toast from "react-hot-toast";

export function DashboardMetricasPage() {
  const { user } = useAuth();
  const [dados,      setDados]      = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
  const carregar = async () => {
    try {
      const [dashRes, pendentesRes] = await Promise.all([
        api.get("/api/dashboard/coordenador").then(r => r.data).catch(() => null),
      listarFilaValidacao().catch(() => null),
]);

      const pendentesLista = pendentesRes?.lista ?? [];

      setDados({
        totalAlunos:          dashRes?.cards?.totalAlunos          ?? "—",
        pendentes:            pendentesRes?.cards?.pendentes ?? pendentesLista.length,
        aprovados:            dashRes?.cards?.aprovados             ?? 0,
        reprovados:           dashRes?.cards?.recusados             ?? 0,
        horasTotaisValidadas: dashRes?.cards?.horasTotaisValidadas  ?? 0,
        distribuicaoPorArea:  dashRes?.grafico                      ?? [],
        taxaAprovacao:        dashRes?.metricas?.taxaAprovacao       ?? null,
        mediaHorasPorAluno:   dashRes?.metricas?.mediaHorasPorAluno  ?? null,
      });
    } catch {
      toast.error("Erro ao carregar dashboard.");
    } finally {
      setCarregando(false);
    }
  };
  carregar();
}, []);

  const primeiroNome = user?.nome?.split(" ")[0] ?? "Coordenador";

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Carregando dashboard...</span>
      </div>
    );
  }

  const d = dados;
  const maxHoras = d.distribuicaoPorArea?.length
    ? Math.max(...d.distribuicaoPorArea.map(a => a.horas))
    : 1;

  const totalValidados = (d.aprovados ?? 0) + (d.reprovados ?? 0);
  const taxaAprovacao = d.taxaAprovacao != null ? `${d.taxaAprovacao}%` : "—";
  const mediaHoras    = d.mediaHorasPorAluno != null ? `${d.mediaHorasPorAluno}h` : "—";

  const cards = [
    { label: "Total de Alunos",        valor: d.totalAlunos,          icon: Users,       iconCls: "text-[#004587]", bgCls: "bg-blue-50"  },
    { label: "Pendentes",              valor: d.pendentes,             icon: Clock,       iconCls: "text-amber-600", bgCls: "bg-amber-50" },
    { label: "Aprovados",              valor: d.aprovados,             icon: CheckCircle, iconCls: "text-green-600", bgCls: "bg-green-50" },
    { label: "Reprovados",             valor: d.reprovados,            icon: XCircle,     iconCls: "text-red-500",   bgCls: "bg-red-50"   },
    { label: "Horas Totais Validadas", valor: `${d.horasTotaisValidadas}h`, icon: BarChart2,  iconCls: "text-[#004587]", bgCls: "bg-blue-50"  },
  ];

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Olá, {primeiroNome}! 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Visão geral das atividades complementares do seu curso.</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full ${c.bgCls} flex items-center justify-center`}>
                <c.icon className={`h-5 w-5 ${c.iconCls}`} />
              </div>
              <span className="text-xs text-slate-500 font-medium leading-tight">{c.label}</span>
            </div>
            <p className={`text-3xl font-bold ${c.iconCls}`}>{c.valor}</p>
          </motion.div>
        ))}
      </div>

      {/* Distribuição por área — só renderiza se vier do backend */}
      {d.distribuicaoPorArea?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm"
        >
          <h2 className="text-base font-semibold text-slate-800 mb-5">Distribuição de Horas por Área</h2>
          <div className="space-y-4">
            {d.distribuicaoPorArea.map((item, i) => {
              const pct = Math.round((item.horas / maxHoras) * 100);
              const nomeArea = item.area ?? item.nomeArea ?? item.nome ?? "—";
              return (
                <motion.div
                  key={nomeArea}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                >
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600">{nomeArea}</span>
                    <span className="text-[#004587] font-semibold">{item.horas}h</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 + i * 0.06 }}
                      className="h-full bg-[#004587] rounded-full"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-4">Total validado: {d.horasTotaisValidadas}h</p>
        </motion.div>
      )}

      {/* Resumo rápido */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: "Taxa de Aprovação", valor: taxaAprovacao,  cls: "text-green-600" },
          { label: "Pendentes em fila", valor: d.pendentes,    cls: "text-amber-600" },
          { label: "Média horas/aluno", valor: mediaHoras,     cls: "text-[#004587]" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.cls}`}>{s.valor}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}