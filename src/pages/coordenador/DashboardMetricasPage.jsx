import { motion } from "framer-motion";
import { Users, Clock, CheckCircle, XCircle, BarChart2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { mockDashboard } from "@/services/mock";

export function DashboardMetricasPage() {
  const { user } = useAuth();
  const d = mockDashboard;
  const maxHoras = Math.max(...d.distribuicaoPorArea.map(a => a.horas));
  const primeiroNome = user?.nome?.split(" ")[0] ?? "Coordenador";

  const cards = [
    { label: "Total de Alunos",       valor: d.totalAlunos,               icon: Users,        iconCls: "text-[#004587]", bgCls: "bg-blue-50"  },
    { label: "Pendentes",             valor: d.pendentes,                  icon: Clock,        iconCls: "text-amber-600", bgCls: "bg-amber-50" },
    { label: "Aprovados",             valor: d.aprovados,                  icon: CheckCircle,  iconCls: "text-green-600", bgCls: "bg-green-50" },
    { label: "Reprovados",            valor: d.reprovados,                 icon: XCircle,      iconCls: "text-red-500",   bgCls: "bg-red-50"   },
    { label: "Horas Totais Validadas",valor: `${d.horasTotaisValidadas}h`, icon: BarChart2,    iconCls: "text-[#004587]", bgCls: "bg-blue-50"  },
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

      {/* Distribuição por área */}
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
            return (
              <motion.div
                key={item.area}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
              >
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600">{item.area}</span>
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

      {/* Resumo rápido */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: "Taxa de Aprovação",  valor: `${Math.round((d.aprovados / (d.aprovados + d.reprovados)) * 100)}%`, cls: "text-green-600" },
          { label: "Pendentes em fila",  valor: d.pendentes,                                                          cls: "text-amber-600" },
          { label: "Média horas/aluno",  valor: `${Math.round(d.horasTotaisValidadas / d.totalAlunos)}h`,             cls: "text-[#004587]" },
        ].map((s, i) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.cls}`}>{s.valor}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
