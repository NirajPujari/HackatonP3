import React from 'react';
import { motion } from 'framer-motion';

export interface CacheData {
  coverage_pct: number;
  cached: number;
  total: number;
}

export interface CacheResponse {
  coverage_by_language?: Record<string, CacheData>;
}

export default function CacheStatsUI({ response }: { response: CacheResponse }) {
  if (!response || !response.coverage_by_language) return null;

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500 space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(response.coverage_by_language).map(([lang, data]: [string, CacheData], index: number) => {
          const pc = data.coverage_pct;
          let color = "bg-red-500";
          if (pc >= 90) color = "bg-emerald-500";
          else if (pc >= 60) color = "bg-amber-500";
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={lang} 
              className="bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col gap-4 shadow-xl hover:-translate-y-1 transition-transform cursor-default"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white tracking-widest uppercase">{lang}</span>
                <span className={`text-[10px] font-mono tracking-widest border px-2 py-0.5 rounded-full ${color.replace('bg-', 'text-')} ${color.replace('bg-', 'border-').concat('/30')} ${color.replace('bg-', 'bg-').concat('/10')}`}>
                  {data.cached} / {data.total}
                </span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner flex relative">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${pc}%` }}
                   transition={{ duration: 1.5, ease: 'easeOut', delay: index * 0.1 }}
                   className={`h-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} 
                 />
              </div>
              <div className="flex justify-end">
                <span className={`text-xs font-mono font-bold tracking-widest ${color.replace('bg-', 'text-')}`}>{pc}% COVERAGE</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}
