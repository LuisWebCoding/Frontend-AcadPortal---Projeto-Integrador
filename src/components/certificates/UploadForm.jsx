import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';

export function UploadForm({ 
  areas, 
  onSubmit, 
  isSubmitting 
}) {
  const [arquivo, setArquivo] = useState(null);
  const [form, setForm] = useState({
    tituloAtividade: "",
    cargaHorariaInformada: "",
    dataAtividade: "",
    areaId: "",
    subcategoriaId: "",
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    if (name === "areaId") {
      setForm({ ...form, areaId: value, subcategoriaId: "" }); // Reseta subcategoria ao mudar área
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!arquivo || !form.areaId || !form.subcategoriaId) return;
    
    const success = await onSubmit(form, arquivo);
    if (success) {
      setForm({ tituloAtividade: "", cargaHorariaInformada: "", dataAtividade: "", areaId: "", subcategoriaId: "" });
      setArquivo(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm"
    >
      <h2 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <Upload className="h-4 w-4" /> Enviar Certificado
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label className="text-xs font-medium text-slate-600 mb-1.5">Título da Atividade</Label>
            <Input 
              required 
              name="tituloAtividade" 
              value={form.tituloAtividade} 
              onChange={handleForm} 
              placeholder="Ex: Workshop de Design Thinking"
              className="h-10 bg-slate-50 border-slate-200"
            />
          </div>
          
          <div>
            <Label className="text-xs font-medium text-slate-600 mb-1.5">Área de Atividade</Label>
            <select 
              required 
              name="areaId" 
              value={form.areaId} 
              onChange={handleForm}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent transition-colors"
            >
              <option value="">Selecione uma área</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-600 mb-1.5">Atividade Específica</Label>
            <select 
              required 
              name="subcategoriaId" 
              value={form.subcategoriaId} 
              onChange={handleForm}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent transition-colors"
            >
              <option value="">Selecione a atividade</option>
              {/* Usando a mesma lista de áreas para preencher as subcategorias conforme solicitado */}
              {areas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-600 mb-1.5">Carga Horária (h)</Label>
            <Input 
              required 
              name="cargaHorariaInformada" 
              type="number" 
              value={form.cargaHorariaInformada} 
              onChange={handleForm} 
              placeholder="Ex: 20"
              className="h-10 bg-slate-50 border-slate-200"
            />
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-600 mb-1.5">Data da Atividade</Label>
            <Input 
              required 
              name="dataAtividade" 
              type="date" 
              value={form.dataAtividade} 
              onChange={handleForm}
              className="h-10 bg-slate-50 border-slate-200"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium text-slate-600 mb-1.5">Comprovante (PDF ou imagem)</Label>
          <label htmlFor="arq" className="flex flex-col items-center gap-2 p-6 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-[#004587] hover:bg-blue-50 transition-colors group">
            <Upload className="h-6 w-6 text-slate-400 group-hover:text-[#004587]" />
            <p className="text-sm text-slate-500">{arquivo ? arquivo.name : "Clique para escolher ou arraste o arquivo"}</p>
            <p className="text-xs text-slate-400">PDF, JPG ou PNG · max 10MB</p>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setArquivo(e.target.files[0])} className="hidden" id="arq" />
          </label>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || !arquivo}
          className="bg-[#004587] hover:bg-[#003566] text-white h-10 px-6 font-semibold"
        >
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Enviando...</>
            : <><Upload className="h-4 w-4 mr-2" /> Enviar Certificado</>}
        </Button>
      </form>
    </motion.div>
  );
}
