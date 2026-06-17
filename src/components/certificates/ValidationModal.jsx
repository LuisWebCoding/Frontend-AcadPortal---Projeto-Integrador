import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';

export function ValidationModal({ 
  modal, 
  onClose, 
  onConfirm, 
  horas, 
  setHoras, 
  obs, 
  setObs, 
  loading 
}) {
  if (!modal) return null;

  const canConfirm = !loading && (modal.tipo === "aprovar" ? !!horas : !!obs);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }} 
          transition={{ duration: 0.15 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${modal.tipo === "aprovar" ? "bg-green-100" : "bg-red-100"}`}>
                {modal.tipo === "aprovar"
                  ? <CheckCircle className="h-5 w-5 text-green-600" />
                  : <XCircle className="h-5 w-5 text-red-500" />}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  {modal.tipo === "aprovar" ? "Aprovar Certificado" : "Reprovar Certificado"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {modal.cert.tituloAtividade} — {modal.cert.nomeAluno}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {modal.cert.arquivoImagem && (
            <a
              href={modal.cert.arquivoImagem}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 mb-4 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#004587] font-medium hover:bg-blue-50 transition-colors w-full"
            >
              <ExternalLink className="h-4 w-4" /> Ver certificado
            </a>
          )}

          <div className="space-y-4">
            {modal.tipo === "aprovar" && (
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5">
                  Horas validadas <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  min="1" 
                  max={modal.cert.cargaHorariaInformada}
                  value={horas} 
                  onChange={e => setHoras(e.target.value)}
                  placeholder={`Máx: ${modal.cert.cargaHorariaInformada}h`}
                  className="h-10 bg-slate-50 border-slate-200"
                />
              </div>
            )}

            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1.5">
                Observação {modal.tipo === "reprovar"
                  ? <span className="text-red-500">*</span>
                  : <span className="text-slate-400">(opcional)</span>}
              </Label>
              <textarea 
                value={obs} 
                onChange={e => setObs(e.target.value)} 
                rows={3}
                placeholder={modal.tipo === "reprovar" ? "Informe o motivo da reprovação..." : "Comentário opcional..."}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#004587] focus:border-transparent resize-none transition-colors" 
              />
            </div>

            <div className="flex gap-3 pt-1">
              <Button 
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 font-medium text-slate-600"
              >
                Cancelar
              </Button>
              <Button 
                onClick={onConfirm} 
                disabled={!canConfirm}
                className={`flex-1 h-10 font-semibold text-white ${
                  modal.tipo === "aprovar" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processando...</> : "Confirmar"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
