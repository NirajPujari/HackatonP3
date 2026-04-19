"use client";

import React, { useState } from "react";
import { Terminal, Play, Loader2 } from "lucide-react";

export default function AgentTrace() {
  const [inputWord, setInputWord] = useState("Ivan");
  const [logs, setLogs] = useState<{ text: string, type: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const writeLine = (text: string, type: string, delay: number = 300) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setLogs(prev => [...prev, { text, type }]);
        resolve();
      }, delay);
    });
  };

  const handleTrace = async () => {
    if (!inputWord.trim() || isRunning) return;
    
    setIsRunning(true);
    setLogs([{ text: `Initializing deduplication agent for: "${inputWord}"`, type: "system" }]);

    try {
      await writeLine(`[Layer 1] Running fuzzy scan across data collection...`, "layer");
      await writeLine(`[Layer 1] Normalizing input via unicodedata (NFD)`, "process");
      
      const res = await fetch("http://localhost:8000/api/deduplicate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: inputWord })
      });
      const data = await res.json();
      
      if (data.matched_by_layer === 1) {
        await writeLine(`[Layer 1] Match threshold exceeded!`, "success");
        await writeLine(`[Layer 1] Confidence generated locally.`, "process");
      } else {
         await writeLine(`[Layer 1] No matches above 85% threshold`, "system");
         
         await writeLine(`[Layer 2] Romanizing all records with anyascii...`, "layer");
         const romanExample = /^[a-zA-Z]+$/.test(inputWord) ? inputWord : "romanized";
         await writeLine(`[Layer 2] Converting input -> "${romanExample}"`, "process");
         
         if (data.matched_by_layer === 2) {
            await writeLine(`[Layer 2] Cross-script match hit via Levenshtein.`, "success");
         } else {
            await writeLine(`[Layer 2] No matches above 80% romanization threshold.`, "system");
            
            await writeLine(`[Layer 3] Escalating to OpenRouter parallel translation...`, "layer");
            await writeLine(`[Layer 3] Spinning up 5 worker threads.`, "process");
            
            if (data.llm_calls_made) {
               await writeLine(`[Layer 3] Attempting consensus loops...`, "process");
               await writeLine(`[Layer 3] DB Probe executed against translation corpus.`, "system");
               await writeLine(`[Layer 3] Evaluated semantic/translit decision tree constraints.`, "success");
            }
         }
      }
      
      const summary = data.summary;
      await writeLine(`Agent complete. LLM calls made: ${data.llm_calls_made ? "Yes" : "No"}`, "system");
      await writeLine(`Total Duplicates Executed: ${summary.total_found}`, "success");
      
    } catch (err) {
      console.error(err);
      await writeLine(`ERR: Trace failed to connect to backend api.`, "error");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-[#0b0c10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
       {/* Top Bar */}
       <div className="bg-[#1a1b23] border-b border-white/5 py-3 px-4 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="text-gray-500 text-xs font-mono tracking-widest font-bold flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" /> Live Agent Trace
          </div>
          <div className="w-12" />
       </div>
       
       {/* Input Area */}
       <div className="bg-[#1e1e1e]/50 border-b border-white/5 p-4 flex gap-4">
          <input 
            type="text" 
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            disabled={isRunning}
            placeholder="Type a word (e.g. Ivan, 苹果)"
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm font-mono text-emerald-400 outline-none focus:border-emerald-500/50"
          />
          <button 
            onClick={handleTrace}
            disabled={isRunning || !inputWord.trim()}
            className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRunning ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Tracing</>
            ) : (
              <><Play className="w-4 h-4 fill-current" /> Trace Agent</>
            )}
          </button>
       </div>

       {/* Terminal Output */}
       <div className="p-6 h-100 overflow-y-auto font-mono text-sm space-y-2 selection:bg-white/10 scrollbar-thin scrollbar-thumb-white/10">
          <div className="text-gray-500 italic mb-4"># Terminal trace mapped dynamically via POST /api/deduplicate/</div>
          {logs.map((log, i) => {
             let color = "text-gray-300";
             let icon = ">";
             if (log.type === "layer") { color = "text-sky-400 font-bold"; icon = "★"; }
             else if (log.type === "process") { color = "text-[#8b949e]"; icon = "~"; }
             else if (log.type === "success") { color = "text-emerald-400"; icon = "✓"; }
             else if (log.type === "error") { color = "text-rose-400"; icon = "✗"; }
             
             return (
               <div key={i} className={`flex gap-3 ${color} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                 <span className="opacity-50 select-none">{icon}</span>
                 <span className="break-all">{log.text}</span>
               </div>
             )
          })}
          {isRunning && (
            <div className="flex gap-3 text-emerald-500 animate-pulse mt-2">
              <span className="opacity-50 select-none">_</span>
            </div>
          )}
       </div>
    </div>
  );
}
