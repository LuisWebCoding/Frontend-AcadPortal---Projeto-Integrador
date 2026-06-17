import { motion } from "framer-motion";
import { Users, Clock, CheckCircle, XCircle, BarChart2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Componentes Reutilizáveis
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DistributionChart } from "@/components/dashboard/DistributionChart";

// Hooks React Query
import { useCoordenadorDashboard } from "@/hooks/useDashboard";
import { useFilaValidacao } from "@/hooks/useCertificados";

export function DashboardMetricasPage() {
  const { user } = useAuth();
  
  const { data: dashRes, isLoading: loadingDash } = useCoordenadorDashboard();
  const { data: pendentesRes, isLoading: loadingPendentes } = useFilaValidacao();

  const carregando = loadingDash || loadingPendentes;

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Carregando dashboard...</span>
      </div>
    );
  }

  const pendentesLista = pendentesRes?.lista ?? [];
  const d = {
    totalAlunos:          dashRes?.cards?.totalAlunos          ?? "—",
    pendentes:            pendentesRes?.cards?.pendentes ?? pendentesLista.length,
    aprovados:            dashRes?.cards?.aprovados             ?? 0,
    reprovados:           dashRes?.cards?.recusados             ?? 0,
    horasTotaisValidadas: dashRes?.cards?.horasTotaisValidadas  ?? 0,
    distribuicaoPorArea:  dashRes?.grafico                      ?? [],
    taxaAprovacao:        dashRes?.metricas?.taxaAprovacao       ?? null,
    mediaHorasPorAluno:   dashRes?.metricas?.mediaHorasPorAluno  ?? null,
  };

  const primeiroNome = user?.nome?.split(" ")[0] ?? "Coordenador";
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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Olá, {primeiroNome}! 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Visão geral das atividades complementares do seu curso.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c, i) => (
          <StatsCard 
            key={c.label}
            label={c.label}
            valor={c.valor}
            icon={c.icon}
            iconClassName={c.iconCls}
            bgClassName={c.bgCls}
            delay={i * 0.05}
          />
        ))}
      </div>

      {d.distribuicaoPorArea?.length > 0 && (
        <DistributionChart 
          data={d.distribuicaoPorArea}
          title="Distribuição de Horas por Área"
          totalLabel="Total validado"
          totalValue={d.horasTotaisValidadas}
        />
      )}

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