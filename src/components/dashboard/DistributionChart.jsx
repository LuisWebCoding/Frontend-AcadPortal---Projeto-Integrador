import React from 'react';
import { motion } from 'framer-motion';

export function DistributionChart({ data, title, totalLabel, totalValue }) {
  const maxHoras = data.length ? Math.max(...data.map(a => a.horas)) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm h-full"
    >
      <h2 className="text-base font-semibold text-slate-800 mb-5">{title}</h2>
      <div className="space-y-4">
        {data.map((item, i) => {
          const pct = Math.round((item.horas / (maxHoras || 1)) * 100);
          const nomeArea = item.area ?? item.nomeArea ?? item.nome ?? "—";
          return (
            <div key={nomeArea}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 truncate mr-2">{nomeArea}</span>
                <span className="text-[#004587] font-semibold shrink-0">{item.horas}h</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 + i * 0.05 }}
                  className="h-full bg-[#004587] rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
      {totalLabel && (
        <p className="text-xs text-slate-400 mt-4">{totalLabel}: {totalValue}h</p>
      )}
    </motion.div>
  );
}
