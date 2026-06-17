import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ProgressCircle({ pct, label, sub, items }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm h-full"
    >
      <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-4 bg-[#004587] rounded-full" /> {label}
      </h2>
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#004587" strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#004587] leading-none">{pct}%</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{sub}</span>
          </div>
        </div>
        <div className="space-y-3 text-sm flex-1 w-full">
          {items.map(r => (
            <div key={r.label} className="flex justify-between items-center group">
              <span className="text-slate-500 font-medium group-hover:text-slate-700 transition-colors">{r.label}</span>
              <span className={cn("px-2 py-0.5 rounded font-bold bg-slate-50", r.className)}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
