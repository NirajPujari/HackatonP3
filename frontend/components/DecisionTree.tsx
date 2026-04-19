"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Tooltip = ({ id, content, activeNode }: { id: string, content: string, activeNode: string | null }) => (
  <AnimatePresence>
    {activeNode === id && (
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-64 bg-black/90 border border-white/20 p-4 rounded-xl shadow-2xl text-xs text-gray-300 leading-relaxed font-sans"
      >
        {content}
      </motion.div>
    )}
  </AnimatePresence>
);

export default function DecisionTree() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="font-mono text-sm overflow-x-auto pb-32 pt-8 flex justify-center">
      <div className="flex flex-col items-center gap-8 relative select-none">
         
         <div 
           className="relative px-6 py-3 bg-[#1e1e1e] border border-white/20 rounded-xl hover:bg-white/5 transition-colors cursor-help"
           onMouseEnter={() => setActiveNode('n1')}
           onMouseLeave={() => setActiveNode(null)}
         >
           Is <span className="text-amber-500">normalized_translation</span> == <span className="text-amber-500">db_record</span>?
           <Tooltip id="n1" content="Evaluates exact string match after diacritics and punctuations are stripped globally via unicodedata." activeNode={activeNode} />
         </div>

         <div className="flex gap-32">
            {/* YES Branch */}
            <div className="flex flex-col items-center gap-4 relative">
              <div className="absolute top-0 -translate-y-8 left-[110%] w-px h-8 bg-white/20 -rotate-45 origin-bottom-left" />
              <div className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">YES</div>
              <div className="w-px h-8 bg-white/20" />
              <div className="px-6 py-3 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-xl font-bold shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                exact (1.0)
              </div>
            </div>

            {/* NO Branch */}
            <div className="flex flex-col items-center gap-4 relative">
              <div className="absolute top-0 -translate-y-8 right-[110%] w-px h-8 bg-white/20 rotate-45 origin-bottom-right" />
              <div className="text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded border border-rose-500/20">NO</div>
              <div className="w-px h-8 bg-white/20" />
              
              <div 
                className="relative px-6 py-3 bg-[#1e1e1e] border border-white/20 rounded-xl hover:bg-white/5 transition-colors cursor-help"
                onMouseEnter={() => setActiveNode('n2')}
                onMouseLeave={() => setActiveNode(null)}
              >
                Is <span className="text-amber-500">anyascii_distance</span> &lt;= 2?
                <Tooltip id="n2" content="Romanizes both records to rough Latin equivalent and measures Levenshtein string distance." activeNode={activeNode} />
              </div>

              <div className="flex gap-20 mt-4">
                 <div className="flex flex-col items-center gap-4">
                   <div className="absolute top-0 -translate-y-4 left-[68%] w-px h-8 bg-white/20 -rotate-30 origin-bottom-left" />
                   <div className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20 text-[10px]">YES (0-1)</div>
                   <div className="w-px h-8 bg-white/20" />
                   <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl font-bold text-xs uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                     translit (0.75)
                   </div>
                 </div>
                 
                 <div className="flex flex-col items-center gap-4">
                    <div className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20 text-[10px]">YES (2)</div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl font-bold text-xs uppercase opacity-80">
                      translit (0.60)
                    </div>
                 </div>

                 <div className="flex flex-col items-center gap-4 relative">
                   <div className="absolute top-0 -translate-y-4 right-[64%] w-px h-8 bg-white/20 rotate-30 origin-bottom-right" />
                   <div className="text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded border border-rose-500/20">NO</div>
                   <div className="w-px h-8 bg-white/20" />
                   
                   <div 
                     className="relative px-6 py-3 bg-[#1e1e1e] border border-white/20 rounded-xl hover:bg-white/5 transition-colors cursor-help text-xs"
                     onMouseEnter={() => setActiveNode('n3')}
                     onMouseLeave={() => setActiveNode(null)}
                   >
                     Contains LLM <span className="text-amber-500">hedge words</span>?
                     <Tooltip id="n3" content="Checks for API apologies like 'unavailable', 'similar to', 'unknown'." activeNode={activeNode} />
                   </div>

                   <div className="flex gap-16 mt-4">
                      {/* Hedge NO */}
                      <div className="flex flex-col items-center gap-4 relative">
                        <div className="absolute top-0 -translate-y-4 left-[80%] w-px h-8 bg-white/20 -rotate-45 origin-bottom-left" />
                        <div className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20 text-[10px]">NO</div>
                        <div className="w-px h-8 bg-white/20" />
                        <div 
                          className="relative px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl font-bold text-xs uppercase cursor-help shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                          onMouseEnter={() => setActiveNode('n4')}
                          onMouseLeave={() => setActiveNode(null)}
                        >
                          semantic
                          <Tooltip id="n4" content="0.95 if it hit cache, 0.85 if live API generated it." activeNode={activeNode} />
                        </div>
                      </div>
                      
                      {/* Hedge YES */}
                      <div className="flex flex-col items-center gap-4 relative">
                         <div className="absolute top-0 -translate-y-4 right-[80%] w-px h-8 bg-white/20 rotate-45 origin-bottom-right" />
                         <div className="text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded border border-rose-500/20 text-[10px]">YES</div>
                         <div className="w-px h-8 bg-white/20" />
                         <div 
                           className="relative px-4 py-2 bg-gray-500/10 border border-gray-500/30 text-gray-400 rounded-xl font-bold text-xs uppercase cursor-help"
                           onMouseEnter={() => setActiveNode('n5')}
                           onMouseLeave={() => setActiveNode(null)}
                         >
                           fuzzy
                           <Tooltip id="n5" content="0.40 - 0.59 calculated algorithmically purely via similarity ratios." activeNode={activeNode} />
                         </div>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
