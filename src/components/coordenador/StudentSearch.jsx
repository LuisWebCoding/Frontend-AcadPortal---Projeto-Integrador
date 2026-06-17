import React from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CertificateTable } from '@/components/certificates/CertificateTable';

export function StudentSearch({ 
  matricula, 
  setMatricula, 
  onSearch, 
  buscando, 
  erro, 
  result 
}) {
  const columns = [
    { label: "Título", key: "tituloAtividade" },
    { label: "Área", key: "area", render: (c) => c.area?.nome ?? "—" },
    { label: "Horas", key: "cargaHorariaInformada", render: (c) => `${c.cargaHorariaInformada}h` },
    { label: "Status", key: "status" },
    { label: "Observação", key: "observacao", render: (c) => <span className="text-slate-400 text-xs">{c.validacao?.observacao ?? "—"}</span> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm"
    >
      <h2 className="text-base font-semibold text-slate-800 mb-4">Buscar Situação</h2>
      <div className="flex gap-3">
        <Input
          type="text"
          value={matricula}
          onChange={e => setMatricula(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSearch()}
          placeholder="Digite a matrícula do aluno"
          className="flex-1 h-10 bg-slate-50 border-slate-200"
        />
        <Button 
          onClick={onSearch} 
          disabled={buscando}
          className="bg-[#004587] hover:bg-[#003566] text-white h-10 px-4 font-semibold"
        >
          {buscando ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
          Buscar Aluno
        </Button>
      </div>

      {erro && <p className="text-sm text-red-500 mt-3">{erro}</p>}

      {result && (
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#004587] font-bold text-sm">
              {result.nome?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{result.nome}</p>
              <p className="text-xs text-slate-400">{result.email} · Matrícula: {result.matricula}</p>
            </div>
          </div>
          
          <CertificateTable 
            certificates={result.certificados} 
            loading={false} 
            columns={columns}
            emptyMessage="Nenhum certificado enviado por este aluno."
          />
        </div>
      )}
    </motion.div>
  );
}
