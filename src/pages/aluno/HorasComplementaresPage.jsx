import { motion } from "framer-motion";
import { CheckCircle, Clock, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Componentes Reutilizáveis
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CertificateTable } from "@/components/certificates/CertificateTable";
import { UploadForm } from "@/components/certificates/UploadForm";

// Hooks React Query
import { useMeusCertificados, useAreas, useEnviarCertificado } from "@/hooks/useCertificados";

const META = 100;

export function HorasComplementaresPage() {
  const { user } = useAuth();
  const { data: certsData, isLoading: loadingCerts } = useMeusCertificados();
  const { data: areas = [], isLoading: loadingAreas }   = useAreas();
  const mutationEnviar = useEnviarCertificado();

  const certs  = Array.isArray(certsData) ? certsData : (certsData?.certificados ?? []);
  const resumo = certsData?.resumo ?? null;

  const handleUpload = async (form, arquivo) => {
    try {
      await mutationEnviar.mutateAsync({
        dados: {
          ...form,
          areaId: Number(form.areaId),
          subcategoriaId: Number(form.subcategoriaId),
          cursoId: Number(user?.cursoId || 1), // Tenta pegar do user, senão usa 1 como fallback (ADS)
          cargaHorariaInformada: Number(form.cargaHorariaInformada),
        },
        arquivo
      });
      return true;
    } catch {
      return false;
    }
  };

  const getCertStatus = (c) => (c.validacao?.status || c.statusValidacao || c.status || "PENDENTE").toUpperCase();

  const horasAprovadas = resumo?.horasValidadas ?? 0;
  const horasPendentes = certs
    .filter(c => getCertStatus(c) === "PENDENTE")
    .reduce((a, c) => a + Number(c.cargaHorariaInformada || 0), 0);
  const pct = Math.min(100, Math.round((horasAprovadas / META) * 100));

  const columns = [
    { label: "Título", key: "tituloAtividade" },
    { label: "Área", key: "area", render: (c) => c.area?.nome ?? "—" },
    { 
      label: "Data de Envio", 
      key: "dataEnvio", 
      render: (c) => c.dataEnvio ? new Date(c.dataEnvio).toLocaleDateString("pt-BR") : "—" 
    },
    { label: "Horas", key: "cargaHorariaInformada", render: (c) => `${c.cargaHorariaInformada}h` },
    { label: "Status", key: "status" }, // Deixa o CertificateTable cuidar do estilo
    { 
      label: "Observação", 
      key: "observacao", 
      render: (c) => <span className="text-slate-400 text-xs">{c.validacao?.observacao ?? "—"}</span> 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Horas Complementares</h1>
        <p className="text-slate-500 text-sm mt-1">Envie seus certificados e acompanhe a validação.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          label="Horas Aprovadas" 
          valor={`${horasAprovadas}h`} 
          icon={CheckCircle} 
          iconClassName="text-green-600" 
          bgClassName="bg-green-50" 
          delay={0}
        />
        <StatsCard 
          label="Horas Pendentes" 
          valor={`${horasPendentes}h`} 
          icon={Clock} 
          iconClassName="text-amber-600" 
          bgClassName="bg-amber-50" 
          delay={0.05}
        />
        <StatsCard 
          label="Meta do Curso" 
          valor={`${META}h`} 
          icon={FileText} 
          iconClassName="text-[#004587]" 
          bgClassName="bg-blue-50" 
          delay={0.1}
        />
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-xs font-bold text-[#004587] uppercase tracking-wider mb-1">Seu Progresso</p>
            <h3 className="text-slate-500 text-sm font-medium">Progresso geral do curso</h3>
          </div>
          <span className="text-slate-900 font-bold text-sm bg-blue-50 px-3 py-1 rounded-lg">
            {horasAprovadas}/{META}h · <span className="text-[#004587]">{pct}%</span>
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${pct}%` }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#004587] to-blue-500 rounded-full shadow-sm" 
          />
        </div>
      </div>

      <UploadForm 
        areas={areas} 
        onSubmit={handleUpload} 
        isSubmitting={mutationEnviar.isPending} 
      />

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-50">
          <h2 className="text-base font-semibold text-slate-800">
            Certificados Enviados {!loadingCerts && `(${certs.length})`}
          </h2>
        </div>
        <CertificateTable 
          certificates={certs} 
          loading={loadingCerts} 
          columns={columns}
          emptyMessage="Nenhum certificado enviado ainda."
        />
      </div>
    </div>
  );
}