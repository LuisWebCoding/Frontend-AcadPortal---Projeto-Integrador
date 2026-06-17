import { motion } from "framer-motion";
import { Clock, TrendingUp, CheckCircle, FileText, ChevronRight, Info, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMeusCertificados } from "@/hooks/useCertificados";
import { useAlunoDashboard } from "@/hooks/useDashboard";
import { useState } from "react";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProgressCircle } from "@/components/dashboard/ProgressCircle";
import { Badge } from "@/components/ui/Badge";

export function AlunoDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dashboard, isLoading: loadingDash } = useAlunoDashboard();
  const { data: certsRes, isLoading: loadingCerts } = useMeusCertificados();
  const [modalCert, setModalCert] = useState(null);

  const carregando = loadingDash || loadingCerts;

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Carregando dashboard...</span>
      </div>
    );
  }

  const certs = Array.isArray(certsRes) ? certsRes : (certsRes?.certificados ?? []);
  const recentes = certs.slice(0, 3);

  const totalExigido   = 100;
  // O backend pode retornar horasConcluidas ou horasValidadas, garantimos a leitura de ambos
  const horasConcluidas = Number(dashboard?.horasConcluidas || dashboard?.horasValidadas || 0);
  const horasFaltantes  = Math.max(0, totalExigido - horasConcluidas);
  const pct = Math.min(100, Math.round((horasConcluidas / totalExigido) * 100));
  
  // Como o backend não está enviando a distribuição no resumo, calculamos localmente dos certificados
  const distribuicao = certs
    .filter(c => (c.validacao?.status || c.statusValidacao || "").toUpperCase() === "APROVADO")
    .reduce((acc, c) => {
      const areaNome = c.area?.nome || c.nomeArea || "Outros";
      const horas = Number(c.validacao?.horasValidadas || c.cargaHorariaInformada || 0);
      const existing = acc.find(item => item.area === areaNome);
      if (existing) {
        existing.horas += horas;
      } else {
        acc.push({ area: areaNome, horas });
      }
      return acc;
    }, []);

  const primeiroNome = user?.nome?.split(" ")[0] ?? "Aluno";

  const getCertStatus = (c) => (c.validacao?.status || c.statusValidacao || c.status || "PENDENTE").toUpperCase();

  const getStatusConfig = (cert) => {
    const s = getCertStatus(cert);
    if (s === "APROVADO")  return { label: "Aprovado",  className: "bg-green-100 text-green-700 hover:bg-green-100" };
    if (s === "RECUSADO" || s === "REPROVADO")  return { label: "Recusado",  className: "bg-red-100 text-red-700 hover:bg-red-100" };
    return { label: "Pendente", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" };
  };

  const progressItems = [
    { label: "Total exigido",    value: `${totalExigido}h`,    className: "text-slate-700" },
    { label: "Horas concluídas", value: `${horasConcluidas}h`, className: "text-[#004587] font-semibold" },
    { label: "Horas faltantes",  value: `${horasFaltantes}h`,  className: "text-amber-600 font-semibold" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Olá, {primeiroNome}! 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Acompanhe seu progresso em horas complementares.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          label="Horas Concluídas" 
          valor={`${horasConcluidas}h`} 
          sub={`de ${totalExigido}h`}
          icon={Clock} 
          bgClassName="bg-blue-50" 
          iconClassName="text-[#004587]" 
          delay={0}
        />
        <StatsCard 
          label="Horas Faltantes" 
          valor={`${horasFaltantes}h`} 
          sub="para concluir"
          icon={TrendingUp} 
          bgClassName="bg-amber-50" 
          iconClassName="text-amber-600" 
          delay={0.05}
        />
        <StatsCard 
          label="Status" 
          valor={pct >= 100 ? "Concluído! 🎉" : "Em andamento"} 
          sub={pct >= 100 ? "Meta atingida" : "Conclusão em andamento"}
          icon={CheckCircle} 
          bgClassName="bg-green-50" 
          iconClassName="text-green-600" 
          valorClassName={pct >= 100 ? "text-green-600 text-xl" : "text-slate-700 text-xl"}
          delay={0.1}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProgressCircle 
          pct={pct} 
          label="Seu Progresso" 
          sub="do total" 
          items={progressItems} 
        />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#004587]" /> Distribuição por Área
          </h2>
          {distribuicao.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <Info className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm">Nenhuma hora aprovada ainda para exibir no gráfico.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {distribuicao.map(({ area, horas }) => (
                <div key={area} className="group">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600 font-medium group-hover:text-[#004587] transition-colors truncate">{area}</span>
                    <span className="text-slate-900 font-bold ml-2 bg-blue-50 px-2 py-0.5 rounded text-[11px]">{horas}h</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${Math.min(100, (horas / (horasConcluidas || 1)) * 100)}%` }} 
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#004587] to-blue-500 rounded-full shadow-sm" 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-slate-50">
          <h2 className="text-base font-semibold text-slate-800">Atividades Recentes</h2>
          <button onClick={() => navigate("/aluno/horas")}
            className="text-sm text-[#004587] hover:underline font-medium">
            Ver todas
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {recentes.length === 0 ? (
            <p className="p-5 text-sm text-slate-400">Nenhuma atividade enviada ainda.</p>
          ) : recentes.map(cert => {
            const s = getStatusConfig(cert.validacao);
            return (
              <div key={cert.id} onClick={() => setModalCert(cert)}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-[#004587]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{cert.tituloAtividade}</p>
                  <p className="text-xs text-slate-400">{cert.area?.nome ?? "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={s.className}>{s.label}</Badge>
                  <span className="text-xs text-slate-400">{cert.cargaHorariaInformada}h</span>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {modalCert && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setModalCert(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">{modalCert.tituloAtividade}</h3>
              <button onClick={() => setModalCert(null)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <ChevronRight className="h-4 w-4 text-slate-400 rotate-180" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Área: </span>
                <span className="text-slate-700 font-medium">{modalCert.area?.nome ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Horas informadas</span>
                <span className="text-slate-700 font-medium">{modalCert.cargaHorariaInformada}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Horas validadas</span>
                <span className="text-slate-700 font-medium">{modalCert.validacao?.horasValidadas ?? "—"}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <Badge variant="secondary" className={getStatusConfig(modalCert.validacao).className}>
                  {getStatusConfig(modalCert.validacao).label}
                </Badge>
              </div>
              {modalCert.validacao?.observacao && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-slate-500 mb-1">Observação do coordenador</p>
                  <p className="text-slate-700 bg-slate-50 rounded-lg p-3 text-xs leading-relaxed">
                    {modalCert.validacao.observacao}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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