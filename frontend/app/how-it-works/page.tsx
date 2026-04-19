"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import DataFlowStepper from "@/components/DataFlowStepper";
import { ArrowDown, Database, Cpu, Search, Sparkles, Box, Check, BrainCircuit, Minus } from "lucide-react";

export default function HowItWorks() {
  const [activeWaterfall, setActiveWaterfall] = useState<"color" | "ivan" | "apple">("color");

  const waterfallData = {
    color: {
      input: "colour",
      target: "color",
      layer: 1,
      title: "Layer 1: Fuzzy",
      desc: "Same script, catches the UK spelling variation instantly without translation."
    },
    ivan: {
      input: "Ivan",
      target: "Иван",
      layer: 2,
      title: "Layer 2: Transliteration",
      desc: "Cross-script match. Both are romanized to 'ivan' via anyascii and matched instantly."
    },
    apple: {
      input: "Apple",
      target: "りんご",
      layer: 3,
      title: "Layer 3: LLM Semantic",
      desc: "Different semantic symbols. Esculates to LLM translator, fetching 'りんご', then probes DB."
    }
  };

  const waterfall = waterfallData[activeWaterfall];

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e2e8f0] selection:bg-amber-500/30 selection:text-amber-200">
      <main className="max-w-5xl mx-auto px-6 py-20 space-y-32">
        {/* HERO */}
        <section className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/5 border border-sky-500/20 text-sky-500 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            Phase 2
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            How It Works
          </motion.h1>
        </section>

        {/* SYSTEM OVERVIEW */}
        <section className="space-y-12">
           <h2 className="text-3xl font-bold tracking-tight text-center">System Overview</h2>
           <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-16 flex flex-col items-center gap-8 relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.1),transparent_50%)] pointer-events-none" />
             
             {/* Flowchart */}
             <div className="flex flex-col items-center z-10 w-full">
                <motion.div whileHover={{ scale: 1.05 }} className="w-48 py-4 bg-gray-800 border border-gray-600 rounded-xl text-center shadow-lg font-bold">User Input</motion.div>
                <ArrowDown className="w-6 h-6 my-2 text-gray-500" />
                <motion.div whileHover={{ scale: 1.05 }} className="w-48 py-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center shadow-[0_0_20px_rgba(16,185,129,0.2)] font-bold text-emerald-400">FastAPI Backend</motion.div>
                <ArrowDown className="w-6 h-6 my-2 text-gray-500" />
                
                <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl w-full max-w-lg text-center relative shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-3 py-0.5 rounded font-bold text-xs uppercase tracking-widest">Core</div>
                   <div className="font-black text-xl text-amber-500 mb-4">3-Layer Deduplication Agent</div>
                   <div className="flex justify-between gap-4">
                     <div className="flex-1 bg-black/40 rounded-lg p-3 border border-white/10 text-xs font-mono">L1: Fuzzy</div>
                     <div className="flex-1 bg-black/40 rounded-lg p-3 border border-white/10 text-xs font-mono">L2: Transliteration</div>
                     <div className="flex-1 bg-black/40 rounded-lg p-3 border border-amber-500/20 text-xs font-mono text-amber-500">L3: Semantic</div>
                   </div>
                </div>

                <div className="flex w-full max-w-lg justify-between mt-4">
                   <div className="flex flex-col items-center">
                     <div className="h-8 border-l-2 border-dashed border-gray-600 mb-2" />
                     <motion.div whileHover={{ scale: 1.05 }} className="w-32 py-4 bg-sky-500/20 border border-sky-500/40 rounded-xl text-center flex flex-col items-center justify-center gap-2 text-sky-400 text-sm font-bold">
                       <Database className="w-5 h-5" /> MongoDB
                     </motion.div>
                   </div>
                   <div className="flex flex-col items-center">
                     <div className="h-8 border-l-2 border-dashed border-gray-600 mb-2" />
                     <motion.div whileHover={{ scale: 1.05 }} className="w-32 py-4 bg-purple-500/20 border border-purple-500/40 rounded-xl text-center flex flex-col items-center justify-center gap-2 text-purple-400 text-sm font-bold">
                       <BrainCircuit className="w-5 h-5" /> OpenRouter LLM
                     </motion.div>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* 3-LAYER PIPELINE */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-3xl font-bold tracking-tight">The 3-Layer Pipeline</h2>
             <p className="text-gray-400 max-w-2xl mx-auto">Cost-optimized routing. Cheap local checks first, expensive API calls last.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
             <div className="bg-[#1e1e1e] border-t-4 border-t-emerald-500 border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                     <div className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Step 1</div>
                     <h3 className="text-xl font-bold">Fuzzy Matching</h3>
                   </div>
                   <Search className="w-5 h-5 text-gray-500" />
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-center space-y-2">
                   <div className="flex justify-center gap-4 text-emerald-400 text-lg">
                      <span>colour</span> <span className="text-gray-600">vs</span> <span>color</span>
                   </div>
                   <div className="text-xs text-gray-500">91% MATCH</div>
                </div>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0"/> Works within same script only</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0"/> Uses rapidfuzz (85% threshold)</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0"/> Best for typos & variants</li>
                  <li className="flex gap-2 text-emerald-400 font-bold"><Minus className="hidden" /> Cost: Instant, Free</li>
                </ul>
             </div>

             <div className="bg-[#1e1e1e] border-t-4 border-t-amber-500 border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                     <div className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Step 2</div>
                     <h3 className="text-xl font-bold">Transliteration</h3>
                   </div>
                   <Cpu className="w-5 h-5 text-gray-500" />
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-center space-y-2">
                   <div className="flex justify-center gap-4 text-amber-500 text-lg">
                      <span>Иван</span> <span className="text-gray-600">→</span> <span>Ivan</span>
                   </div>
                   <div className="text-xs text-gray-500">ROMANIZATION MATCH</div>
                </div>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0"/> Converts all to Latin (anyascii)</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0"/> Cross-script fuzzing (80% threshold)</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0"/> Catches Ivan/Иван/イワン</li>
                  <li className="flex gap-2 text-emerald-400 font-bold"><Minus className="hidden" /> Cost: Instant, Free</li>
                </ul>
             </div>

             <div className="bg-[#1e1e1e] border-t-4 border-t-purple-500 border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                     <div className="text-purple-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Step 3</div>
                     <h3 className="text-xl font-bold">LLM Semantic</h3>
                   </div>
                   <Sparkles className="w-5 h-5 text-gray-500" />
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-center space-y-2">
                   <div className="flex justify-center gap-4 text-purple-400 text-lg">
                      <span>Apple</span> <span className="text-gray-600">→</span> <span>りんご</span>
                   </div>
                   <div className="text-xs text-gray-500">PARALLEL TRANSLATION</div>
                </div>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-purple-500 shrink-0"/> Only reached if L1/L2 fail</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-purple-500 shrink-0"/> Probes DB with 9 language variants</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-purple-500 shrink-0"/> True semantic equivalents</li>
                  <li className="flex gap-2 text-rose-400 font-bold"><Minus className="hidden" /> Cost: Native API Tokens</li>
                </ul>
             </div>
          </div>
        </section>

        {/* WATERFALL EXPLORER */}
        <section className="max-w-3xl mx-auto space-y-8">
           <h3 className="text-2xl font-bold tracking-tight text-center">Waterfall Logic Explainer</h3>
           <div className="bg-white/5 border border-white/10 p-2 rounded-2xl flex max-w-md mx-auto">
             {(["color", "ivan", "apple"] as const).map(w => (
               <button 
                 key={w}
                 onClick={() => setActiveWaterfall(w)}
                 className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${
                   activeWaterfall === w ? "bg-amber-500 text-black shadow-lg" : "text-gray-400 hover:text-white"
                 }`}
               >
                 {w}
               </button>
             ))}
           </div>
           
           <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl">
             <div className="flex items-center gap-8 text-3xl font-mono font-black text-white">
                <span>{waterfall.input}</span>
                <Search className="w-6 h-6 text-amber-500" />
                <span>{waterfall.target}</span>
             </div>
             <div className="w-full h-px bg-white/10" />
             <div className="text-center">
                <div className="inline-flex py-1 px-3 bg-amber-500/10 text-amber-500 font-bold uppercase tracking-widest text-xs rounded mb-3 border border-amber-500/20">{waterfall.title}</div>
                <p className="text-gray-400 leading-relaxed max-w-lg mx-auto">{waterfall.desc}</p>
             </div>
           </div>
        </section>

        {/* CONFIDENCE SCORING */}
        <section className="space-y-12">
            <h2 className="text-3xl font-bold tracking-tight text-center">Confidence Post-Scoring</h2>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#1e1e1e]">
               <table className="w-full text-left">
                  <thead className="bg-[#0b0c10] border-b border-white/5 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                     <tr>
                        <th className="px-6 py-4">Match Type</th>
                        <th className="px-6 py-4">When Used</th>
                        <th className="px-6 py-4 text-center">Confidence Range</th>
                        <th className="px-6 py-4">Color Base</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                     <tr className="hover:bg-white/5">
                        <td className="px-6 py-4 font-bold text-sky-400 uppercase tracking-wider text-xs">exact</td>
                        <td className="px-6 py-4 text-gray-300">Perfect string block match (normalized)</td>
                        <td className="px-6 py-4 text-center font-mono font-bold">100%</td>
                        <td className="px-6 py-4 text-sky-400">Blue</td>
                     </tr>
                     <tr className="hover:bg-white/5">
                        <td className="px-6 py-4 font-bold text-purple-400 uppercase tracking-wider text-xs">semantic</td>
                        <td className="px-6 py-4 text-gray-300">LLM confirmed correlation w/o hedges</td>
                        <td className="px-6 py-4 text-center font-mono font-bold">85 - 95%</td>
                        <td className="px-6 py-4 text-purple-400">Purple</td>
                     </tr>
                     <tr className="hover:bg-white/5">
                        <td className="px-6 py-4 font-bold text-amber-500 uppercase tracking-wider text-xs">transliteration</td>
                        <td className="px-6 py-4 text-gray-300">Romanized Levenshtein distances 0~2</td>
                        <td className="px-6 py-4 text-center font-mono font-bold">60 - 75%</td>
                        <td className="px-6 py-4 text-amber-500">Amber</td>
                     </tr>
                     <tr className="hover:bg-white/5">
                        <td className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs">fuzzy</td>
                        <td className="px-6 py-4 text-gray-300">Resignation threshold fallback</td>
                        <td className="px-6 py-4 text-center font-mono font-bold">40 - 59%</td>
                        <td className="px-6 py-4 text-gray-500">Gray</td>
                     </tr>
                  </tbody>
               </table>
            </div>
        </section>

        {/* CACHE SYSTEM & DATA FLOW */}
        <section className="space-y-12">
            <h2 className="text-3xl font-bold tracking-tight text-center">Data Lifecycle</h2>
            <DataFlowStepper />

            <div className="max-w-3xl mx-auto bg-sky-500/5 border border-sky-500/20 rounded-3xl p-8 text-center space-y-6">
                <Box className="w-10 h-10 text-sky-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Zero-Cost Cache Wrapping</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto">
                  Every outbound LLM payload checks Mongo `cache` first via exact Normalized pairings. Cache hits circumvent OpenRouter HTTP dispatches entirely, meaning predictable scale and guaranteed 0 token burning for repetition.
                </p>
                <div className="inline-flex bg-sky-500/20 text-sky-400 font-mono text-xs px-4 py-2 rounded-lg font-bold">
                  Cache Hit = 0 API Tokens Spent
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
