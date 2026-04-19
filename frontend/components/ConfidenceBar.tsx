import React from 'react';
import { motion } from 'framer-motion';

export default function ConfidenceBar({ score }: { score: number }) {
  const percentage = Math.round(score * 100);
  let color = "bg-red-500";
  if (percentage >= 85) color = "bg-emerald-500";
  else if (percentage >= 60) color = "bg-amber-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${color}`}
        />
      </div>
      <span className={`text-xs font-mono font-bold ${color.replace('bg-', 'text-')} w-8`}>
        {percentage}%
      </span>
    </div>
  );
}
