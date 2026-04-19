import React from 'react';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';

export default function LayerPipeline({ matchedLayer, llmCallsMade }: { matchedLayer: number, llmCallsMade: boolean }) {
  const steps = [
    { title: "L1: Fuzzy", index: 1 },
    { title: "L2: Transliteration", index: 2 },
    { title: "L3: LLM Semantic", index: 3 }
  ];

  return (
    <div className="space-y-4 py-4 px-6 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 to-transparent pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Execution Pipeline</h4>
        <div className="flex items-center gap-2">
           <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">LLM calls made:</span>
           {llmCallsMade ? (
             <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">YES</span>
           ) : (
             <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">NO ✓</span>
           )}
        </div>
      </div>
      
      <div className="flex items-center relative gap-2 mt-6 z-10">
        <div className="absolute left-[15%] right-[15%] top-1/2 h-0.5 bg-white/10 -translate-y-1/2" />
        {steps.map((step, i) => {
          const isActive = step.index === matchedLayer;
          const isSkipped = step.index > matchedLayer;
          
          let icon = <Check className="w-4 h-4 text-white" />;
          if (isActive) icon = <Check className="w-4 h-4 text-black" />;
          if (isSkipped) icon = <Minus className="w-4 h-4 text-gray-500" />;
          
          let bg = "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
          if (isActive) bg = "bg-amber-500 ring-4 ring-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.5)]";
          if (isSkipped) bg = "bg-[#1e1e1e] border-2 border-white/10";

          return (
            <div key={step.index} className={`flex-1 flex flex-col items-center gap-3 transition-opacity duration-500 ${isSkipped ? "opacity-40" : "opacity-100"}`}>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center relative ${bg}`}
              >
                 {isActive && (
                    <motion.div className="absolute inset-0 rounded-full border border-amber-500" animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
                 )}
                 {icon}
              </motion.div>
              <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? "text-amber-500" : isSkipped ? "text-gray-500" : "text-emerald-500"}`}>
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  );
}
