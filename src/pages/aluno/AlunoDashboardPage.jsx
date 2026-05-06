import { motion } from "framer-motion";
import { Clock, TrendingUp, CheckCircle, XCircle, FileText, ChevronRight, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { mockCertificados, mockAreas } from "@/services/mock";
import { useNavigate } from "react-router-dom";

const META = 200;

export function AlunoDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const aprovados  = mockCertificados.filter(c => c.statusValidacao === "APROVADO");
  const pendentes  = mockCertificados.filter(c => !c.statusValidacao);
  const reprovados = mockCertificados.filter(c => c.statusValidacao === "REPROVADO");
  const horasConcluidas = aprovados.reduce((a, c) => a + Number(c.cargaHorariaInformada), 0);
  const horasFaltantes  = Math.max(0, META - horasConcluidas);
  const pct = Math.min(100, Math.round((horasConcluidas / META) * 100));

  // Distribuicao por area
  const porArea = mockCertificados
    .filter(c => c.statusValidacao === "APROVADO")
    .reduce((acc, c) => {
      acc[c.nomeArea] = (acc[c.nomeArea] || 0) + Number(c.cargaHorariaInformada);
      return acc;
    }, {});

  const primeiroNome = user?.nome?.split(" ")[0] ?? "Aluno";

  const STATUS_CHIP = {
    APROVADO:  { label: "Aprovado",  className: "bg-green-100 text-green-700" },
    REPROVADO: { label: "Reprovado", className: "bg-red-100 text-red-700"     },
    null:      { label: "Pendente",  className: "bg-amber-100 text-amber-700" },
  };

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Olá, {primeiroNome}! 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Acompanhe seu progresso em horas complementares.</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#004587]" />
            </div>
            <span className="text-sm text-slate-500 font-medium">Horas Concluídas</span>
          </div>
          <p className="text-3xl font-bold text-[#004587]">{horasConcluidas}h</p>
          <p className="text-xs text-slate-400 mt-1">de {META}h</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-sm text-slate-500 font-medium">Horas Faltantes</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">{horasFaltantes}h</p>
          <p className="text-xs text-slate-400 mt-1">para concluir</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-slate-500 font-medium">Status</span>
          </div>
          <p className="text-lg font-bold text-green-600">
            {pct >= 100 ? "Concluído! 🎉" : "Em andamento"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {pct >= 100 ? "Meta atingida" : "Conclusão em andamento"}
          </p>
        </motion.div>
      </div>

      {/* Progresso + Distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Progresso circular */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Seu Progresso</h2>
          <div className="flex items-center gap-8">
            {/* Círculo de progresso */}
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
                { label: "Total exigido",     valor: `${META}h`,         cls: "text-slate-700" },
                { label: "Horas concluídas",  valor: `${horasConcluidas}h`, cls: "text-[#004587] font-semibold" },
                { label: "Horas faltantes",   valor: `${horasFaltantes}h`,  cls: "text-amber-600 font-semibold" },
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
          {Object.keys(porArea).length === 0 ? (
            <p className="text-slate-400 text-sm">Nenhuma hora aprovada ainda.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(porArea).map(([area, horas]) => (
                <div key={area}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 truncate">{area}</span>
                    <span className="text-slate-800 font-semibold ml-2">{horas}h</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full">
                    <div
                      className="h-full bg-[#004587] rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (horas / horasConcluidas) * 100)}%` }}
                    />
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
          <button onClick={() => navigate("/aluno/horas")} className="text-sm text-[#004587] hover:underline font-medium">
            Ver todas as atividades
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {mockCertificados.slice(0, 3).map(cert => {
            const s = STATUS_CHIP[cert.statusValidacao] ?? STATUS_CHIP[null];
            return (
              <div key={cert.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-[#004587]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{cert.tituloAtividade}</p>
                  <p className="text-xs text-slate-400">{cert.nomeArea}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.className}`}>{s.label}</span>
                  <span className="text-xs text-slate-400">{cert.cargaHorariaInformada}h</span>
                  <span className="text-xs text-slate-400">{cert.dataEnvio}</span>
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