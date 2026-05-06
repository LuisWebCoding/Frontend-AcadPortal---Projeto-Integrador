import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { mockCertificados, mockAreas } from "@/services/mock";
import toast from "react-hot-toast";

const STATUS = {
  APROVADO:  { label: "Aprovado",  className: "bg-green-100 text-green-700" },
  REPROVADO: { label: "Reprovado", className: "bg-red-100 text-red-700"     },
};
const getStatus = (s) => s ? (STATUS[s] ?? { label: s, className: "bg-slate-100 text-slate-600" }) : { label: "Pendente", className: "bg-amber-100 text-amber-700" };

export function HorasComplementaresPage() {
  const [certs, setCerts]         = useState(mockCertificados);
  const [arquivo, setArquivo]     = useState(null);
  const [enviando, setEnviando]   = useState(false);
  const [form, setForm] = useState({ tituloAtividade: "", cargaHorariaInformada: "", dataAtividade: "", idArea: "" });

  const horasAprovadas = certs.filter(c => c.statusValidacao === "APROVADO").reduce((a, c) => a + Number(c.cargaHorariaInformada), 0);
  const horasPendentes = certs.filter(c => !c.statusValidacao).reduce((a, c) => a + Number(c.cargaHorariaInformada), 0);
  const META = 200;
  const pct  = Math.min(100, Math.round((horasAprovadas / META) * 100));

  const handleForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!arquivo) { toast.error("Selecione um arquivo"); return; }
    setEnviando(true);
    await new Promise(r => setTimeout(r, 700));
    const area = mockAreas.find(a => a.id === Number(form.idArea));
    setCerts(prev => [{
      id: Date.now(), ...form,
      cargaHorariaInformada: Number(form.cargaHorariaInformada),
      dataEnvio: new Date().toISOString().split("T")[0],
      nomeAluno: "Ana Clara Rodrigues",
      statusValidacao: null,
      nomeArea: area?.nome ?? "",
      observacao: null,
    }, ...prev]);
    setForm({ tituloAtividade: "", cargaHorariaInformada: "", dataAtividade: "", idArea: "" });
    setArquivo(null);
    setEnviando(false);
    toast.success("Certificado enviado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Horas Complementares</h1>
        <p className="text-slate-500 text-sm mt-1">Envie seus certificados e acompanhe a validação.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Horas Aprovadas", valor: `${horasAprovadas}h`, icon: CheckCircle, cls: "text-green-600", bg: "bg-green-50" },
          { label: "Horas Pendentes", valor: `${horasPendentes}h`, icon: Clock,        cls: "text-amber-600", bg: "bg-amber-50" },
          { label: "Meta do Curso",   valor: `${META}h`,           icon: FileText,     cls: "text-[#004587]", bg: "bg-blue-50" },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center shrink-0`}>
              <c.icon className={`h-5 w-5 ${c.cls}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className={`text-2xl font-bold ${c.cls}`}>{c.valor}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barra progresso */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-slate-700">Progresso geral</span>
          <span className="text-slate-500">{horasAprovadas}/{META}h · {pct}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-[#004587] rounded-full" />
        </div>
      </div>

      {/* Formulário */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2">
          <Upload className="h-4 w-4" /> Enviar Certificado
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Título da Atividade", name: "tituloAtividade",       type: "text",   ph: "Ex: Workshop de Design Thinking" },
              { label: "Carga Horária (h)",   name: "cargaHorariaInformada", type: "number", ph: "Ex: 20" },
              { label: "Data da Atividade",   name: "dataAtividade",         type: "date",   ph: "" },
            ].map(f => (
              <div key={f.name}>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">{f.label}</label>
                <input required name={f.name} type={f.type} value={form[f.name]} onChange={handleForm} placeholder={f.ph}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Área de Atividade</label>
              <select required name="idArea" value={form.idArea} onChange={handleForm}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent">
                <option value="">Selecione uma área</option>
                {mockAreas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Comprovante (PDF ou imagem)</label>
            <label htmlFor="arq" className="flex flex-col items-center gap-2 p-6 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-[#004587] hover:bg-blue-50 transition-colors">
              <Upload className="h-6 w-6 text-slate-400" />
              <p className="text-sm text-slate-500">{arquivo ? arquivo.name : "Clique para escolher ou arraste o arquivo"}</p>
              <p className="text-xs text-slate-400">PDF, JPG ou PNG · max 10MB</p>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setArquivo(e.target.files[0])} className="hidden" id="arq" />
            </label>
          </div>

          <button type="submit" disabled={enviando}
            className="px-6 py-2.5 bg-[#004587] hover:bg-[#003566] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
            {enviando ? "Enviando..." : <><Upload className="h-4 w-4" /> Enviar Certificado</>}
          </button>
        </form>
      </motion.div>

      {/* Tabela */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-50">
          <h2 className="text-base font-semibold text-slate-800">Certificados Enviados ({certs.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50">
                {["Título", "Área", "Data de Envio", "Horas", "Status", "Observação"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {certs.map(cert => {
                const s = getStatus(cert.statusValidacao);
                return (
                  <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-700">{cert.tituloAtividade}</td>
                    <td className="px-5 py-4 text-slate-500">{cert.nomeArea}</td>
                    <td className="px-5 py-4 text-slate-500">{cert.dataEnvio}</td>
                    <td className="px-5 py-4 font-medium">{cert.cargaHorariaInformada}h</td>
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
    </div>
  );
}