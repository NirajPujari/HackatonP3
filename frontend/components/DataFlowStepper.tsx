"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function DataFlowStepper() {
  const steps = [
    { title: "Stage 1 — Raw Input", content: '"Ivan"' },
    { title: "Stage 2 — Normalized", content: '"ivan"' },
    { title: "Stage 3 — Romanized", content: '"ivan" (already Latin)' },
    { title: "Stage 4 — Translations", content: '{ "Russian": "Иван", "Japanese": "イワン" }' },
    { title: "Stage 5 — DB Results", content: '[{ "name": "Иван", "lang": "Russian" }]' },
    { title: "Stage 6 — Final Output", content: '{ "confidence": 0.75, "match_type": "transliteration" }' }
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="bg-[#0b0c10] border border-white/10 p-8 rounded-3xl shadow-xl w-full max-w-3xl mx-auto space-y-8">
      <div className="h-24 relative flex items-center justify-center p-4 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
         <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-amber-500 font-mono text-center"
            >
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-sans font-bold">{steps[activeStep].title}</div>
              <div className="text-xl md:text-2xl">{steps[activeStep].content}</div>
            </motion.div>
         </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
         <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-2 transition-all duration-300 rounded-full ${i <= activeStep ? 'w-8 bg-amber-500' : 'w-2 bg-white/10'}`} />
            ))}
         </div>
         {activeStep < steps.length - 1 ? (
           <button onClick={handleNext} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm font-bold uppercase tracking-wider text-white">
             Next Stage <ChevronRight className="w-4 h-4" />
           </button>
         ) : (
           <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black transition-colors rounded-lg text-sm font-bold uppercase tracking-wider">
             Reset Flow
           </button>
         )}
      </div>
    </div>
  );
}
