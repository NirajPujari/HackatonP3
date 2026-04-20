"use client";

import React from "react";
import { motion } from "framer-motion";
import AgentTrace from "@/components/AgentTrace";
import DecisionTree from "@/components/DecisionTree";
import CodeSpotlight from "@/components/CodeSpotlight";
import { Gauge, Clock, ArrowRightLeft, ShieldAlert } from "lucide-react";

export default function TheAgent() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e2e8f0] selection:bg-amber-500/30 selection:text-amber-200">
      <main className="max-w-5xl mx-auto px-6 py-20 space-y-32">
        {/* HERO */}
        <section className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/5 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            Phase 3
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            The Agent
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Peek behind the curtain. Explore the exact logic blocks, terminal traces, and decision nodes that power DataDock Intelligence.
          </p>
        </section>

        {/* AGENT TRACE */}
        <section className="space-y-12">
            <h2 className="text-3xl font-bold tracking-tight text-center">Live Terminal Trace</h2>
            <div className="max-w-3xl mx-auto">
               <AgentTrace />
            </div>
        </section>

        {/* CONSENSUS LOOP */}
        <section className="space-y-12">
            <h2 className="text-3xl font-bold tracking-tight text-center">The Consensus Loop</h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
               <div className="bg-[#1e1e1e] border border-white/10 rounded-3xl p-8 space-y-6 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                     <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">5-Iteration Retry Logic</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Connecting to external LLMs opens the system up to network timeouts, rate limits, and JSON formatting hallucinations. We wrap all external translation calls in a strictly enforced 5-retry `tenacity` loop. If an LLM hallucinates an invalid schema, the agent drops it and tries again up to 5 times.
                  </p>
               </div>
               
               <div className="bg-[#1e1e1e] border border-white/10 rounded-3xl p-8 space-y-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-amber-500/5 transition-opacity opacity-0 group-hover:opacity-100" />
                  <Gauge className="w-16 h-16 text-amber-500 mb-4" />
                  <div className="text-center">
                     <span className="block text-4xl font-black font-mono text-white mb-2">~1.2s</span>
                     <span className="text-sm font-bold uppercase tracking-widest text-amber-500">Average LLM Esculation Latency</span>
                  </div>
               </div>
            </div>
        </section>

        {/* DECISION TREE */}
        <section className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Scoring Decision Tree</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                How exactly do we arrive at 0.75 confidence instead of 0.85? Hover over nodes for context.
              </p>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-3xl w-full overflow-hidden shadow-inner p-4 md:p-8">
               <DecisionTree />
            </div>
        </section>

        {/* CODE SPOTLIGHT */}
        {/* <section className="space-y-12">
            <h2 className="text-3xl font-bold tracking-tight text-center">Core Logic Extraction</h2>
            <div className="max-w-5xl mx-auto">
               <CodeSpotlight />
            </div>
        </section> */}

      </main>
    </div>
  );
}
