import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export function StatsCard({ 
  label, 
  valor, 
  sub,
  icon: Icon, 
  iconClassName, 
  bgClassName, 
  valorClassName,
  delay = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="border-slate-100 shadow-sm h-full">
        <CardContent className="flex flex-col gap-3 py-5">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              bgClassName
            )}>
              <Icon className={cn("h-5 w-5", iconClassName)} />
            </div>
            <span className="text-sm text-slate-500 font-medium leading-tight">{label}</span>
          </div>
          <div>
            <p className={cn("text-3xl font-bold", valorClassName || iconClassName)}>{valor}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
