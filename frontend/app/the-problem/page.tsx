"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyX, Database, HardDrive, XCircle, CheckCircle2 } from "lucide-react";

export default function TheProblem() {
  const animatedWords = ["Apple", "りんご", "苹果", "тфаха", "আপেল"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % animatedWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [animatedWords.length]);

  const languages = ["EN", "JP", "ZH", "RU", "HI", "AR", "TH", "ID", "KN"];

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e2e8f0] selection:bg-amber-500/30 selection:text-amber-200">
      <main className="max-w-5xl mx-auto px-6 py-20 space-y-32">
        {/* HERO SECTION */}
        <section className="text-center space-y-8 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            Phase 1
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            The Duplicate Data<br/><span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-600">Problem</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-3xl leading-relaxed"
          >
            Datasets from multiple sources contain the exact same entity written in completely different languages and scripts. How do you deduplicate what you can&apos;t compare?
          </motion.p>
          
          <div className="pt-10 h-32 flex items-center justify-center border border-white/5 bg-black/20 rounded-2xl w-full max-w-xl mx-auto overflow-hidden relative shadow-inner">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={wordIndex}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: "anticipate" }}
                className="absolute text-5xl md:text-6xl font-black text-white px-8 py-4"
              >
                {animatedWords[wordIndex]}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,17,23,1)_0%,transparent_15%,transparent_85%,rgba(15,17,23,1)_100%)] pointer-events-none" />
          </div>
        </section>

        {/* WHY STRING MATCHING FAILS */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Why String Matching Fails</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Traditional distance algorithms (like Levenshtein) compare character codes sequence-by-sequence. Across writing systems, this concept breaks entirely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between text-sm uppercase tracking-widest text-rose-500 font-bold mb-4">
                  <span>Cross-Script</span>
                  <XCircle className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between text-3xl font-mono border-b border-rose-500/20 pb-4">
                   <span>Apple</span>
                   <span className="text-gray-500 font-sans mx-4">vs</span>
                   <span>りんご</span>
                </div>
                <div className="flex justify-between items-end">
                   <span className="text-gray-400 text-sm">Similarity Score</span>
                   <span className="text-rose-500 font-black text-4xl font-mono">0%</span>
                </div>
                <p className="text-xs text-rose-400/80 leading-relaxed font-mono">
                  Technically exact matches in reality, but algorithms see 0 shared character matrices.
                </p>
             </div>

             <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between text-sm uppercase tracking-widest text-emerald-500 font-bold mb-4">
                  <span>Same-Script (Trivial)</span>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between text-3xl font-mono border-b border-emerald-500/20 pb-4">
                   <span>Apple</span>
                   <span className="text-gray-500 font-sans mx-4">vs</span>
                   <span>Aple</span>
                </div>
                <div className="flex justify-between items-end">
                   <span className="text-gray-400 text-sm">Similarity Score</span>
                   <span className="text-emerald-500 font-black text-4xl font-mono">89%</span>
                </div>
                <p className="text-xs text-emerald-400/80 leading-relaxed font-mono">
                  Characters overlap standardly. Easy to catch, completely ignores the real problem.
                </p>
             </div>
          </div>
        </section>

        {/* REAL WORLD IMPACT */}
        <section className="space-y-12">
          <div className="text-center">
             <h2 className="text-3xl font-bold tracking-tight">Real World Impact</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4 shadow-xl">
               <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30 text-amber-400">
                  <CopyX className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold">Duplicate Product Listings</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                 The same product in EN/JP/ZH appears 3 separate times across search indexes, inflating the database catalog by over 200%.
               </p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4 shadow-xl">
               <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center border border-sky-500/30 text-sky-400">
                  <Database className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold">Broken Analytics</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Customer purchases, views, and interactions are fractionalized. Metrics double/triple count identically-targeted entities.
               </p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4 shadow-xl">
               <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center border border-rose-500/30 text-rose-400">
                  <HardDrive className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold">Wasted Storage</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Redundant records consume unnecessary relational resources, ballooning indexing costs and complicating caching layers.
               </p>
            </motion.div>
          </div>
        </section>

        {/* SCALE OF THE CHALLENGE */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">The Scale of the Challenge</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Targeting <span className="text-white font-bold">9 languages</span> doesn&apos;t map linearly. It requires solving identical intents across <span className="text-amber-500 font-bold">72 unique directional pairs</span>.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-[#0b0c10] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
             {/* grid visual */}
             <div className="grid grid-cols-10 gap-1 text-[10px] font-mono font-bold text-center">
                <div className="p-2 border-b border-r border-transparent"></div>
                {languages.map(l => <div key={`hdr-${l}`} className="p-2 border-b border-white/5 text-gray-500">{l}</div>)}
                
                {languages.map((rowLang, r) => (
                  <React.Fragment key={`row-${r}`}>
                    <div className="p-2 border-r border-white/5 text-gray-500 flex items-center justify-center">{rowLang}</div>
                    {languages.map((colLang, c) => {
                      const isSame = rowLang === colLang;
                      return (
                        <div key={`cell-${r}-${c}`} className={`p-2 rounded-sm ${isSame ? 'bg-white/5 text-gray-700' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                          {isSame ? '—' : 'X'}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
