import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Loader2 } from 'lucide-react';

const STATUS_VARIANTS = {
  APROVADO:  { label: "Aprovado",  variant: "default", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  RECUSADO:  { label: "Recusado",  variant: "destructive", className: "bg-red-100 text-red-700 hover:bg-red-100" },
  REPROVADO: { label: "Reprovado", variant: "destructive", className: "bg-red-100 text-red-700 hover:bg-red-100" },
  PENDENTE:  { label: "Pendente",  variant: "secondary", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
};

const getStatusConfig = (status) => {
  return STATUS_VARIANTS[status] || { label: status || "Pendente", variant: "outline", className: "bg-slate-100 text-slate-600" };
};

export function CertificateTable({ 
  certificates, 
  loading, 
  columns, 
  renderActions,
  emptyMessage = "Nenhum certificado encontrado."
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Carregando...</span>
      </div>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className="px-5 py-3 text-xs font-medium text-slate-500">
                {col.label}
              </TableHead>
            ))}
            {renderActions && <TableHead className="px-5 py-3 text-xs font-medium text-slate-500">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((cert) => (
            <TableRow key={cert.id} className="hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <TableCell key={`${cert.id}-${col.key}`} className="px-5 py-4">
                  {col.render ? col.render(cert) : (
                    col.key === 'status' ? (
                      (() => {
                        const s = (cert.statusValidacao || cert.status || cert.validacao?.status || "PENDENTE").toUpperCase();
                        const config = getStatusConfig(s);
                        return (
                          <Badge 
                            variant={config.variant}
                            className={config.className}
                          >
                            {config.label}
                          </Badge>
                        );
                      })()
                    ) : (
                      <span className="text-slate-700">{cert[col.key]}</span>
                    )
                  )}
                </TableCell>
              ))}
              {renderActions && (
                <TableCell className="px-5 py-4">
                  {renderActions(cert)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
