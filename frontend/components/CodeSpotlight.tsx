"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeSpotlight() {
  const snippets = [
    {
      id: "waterfall",
      title: "The Waterfall (agent.py)",
      desc: "Layer 1 -> Layer 2 -> Layer 3 early exit logic to minimize token burning.",
      code: `    # Layer 1
    l1_results = layer1_fuzzy_match(input_word, all_records)
    if l1_results: return format(l1_results)

    # Layer 2
    l2_results = layer2_transliteration_match(input_word, all_records)
    if l2_results: return format(l2_results)

    # Layer 3 (Expensive LLM)
    result = translate_multi(normalized_input, languages)`
    },
    {
      id: "romanization",
      title: "Romanization (matcher.py)",
      desc: "Converting any script to Latin to resolve cross-script barriers.",
      code: `def layer2_transliteration_match(input_word, candidates):
    romanized_input = anyascii(input_word).lower()
    
    for candidate in candidates:
        romanized_cand = anyascii(candidate["name"]).lower()
        score = fuzz.ratio(romanized_input, romanized_cand)
        
        if score >= 80:
            results.append({"confidence": 0.75})`
    },
    {
      id: "cache",
      title: "Zero-Cost Cache (translator.py)",
      desc: "Intercepting translating loops before executing external requests.",
      code: `def translate(word: str, lang: str):
    normalized_word = normalize_word(word)
    
    cached = get_cached_translation(normalized_word, lang)
    if cached:
        return {"translation": cached["translated_word"], "cache_hit": True}

    # API request mapping...
    return {"translation": translated_word, "cache_hit": False}`
    }
  ];

  const [activeId, setActiveId] = useState("waterfall");
  const activeSnippet = snippets.find(s => s.id === activeId)!;

  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-100 shadow-2xl">
       {/* Sidebar */}
       <div className="w-full md:w-64 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto">
          {snippets.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`text-left px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal shrink-0 ${
                activeId === s.id 
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-widest leading-relaxed">{s.title}</div>
            </button>
          ))}
       </div>

       {/* Main */}
       <div className="flex-1 p-0 md:p-8 space-y-4 bg-[#0b0c10] flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 p-8 pt-6 pointer-events-none opacity-10 blur-[1px]">
             <span className="text-8xl font-black text-amber-500 italic block">{"{}"}</span>
          </div>
          
          <div className="px-6 md:px-0 z-10 w-full mb-4">
             <div className="inline-flex px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded mb-3 border border-white/10">
               Context
             </div>
             <p className="text-gray-300 md:text-lg leading-relaxed max-w-lg">
               {activeSnippet.desc}
             </p>
          </div>
          
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg z-10 mx-6 md:mx-0 bg-[#1e1e1e]">
             <SyntaxHighlighter
               language="python"
               style={atomDark}
               customStyle={{ margin: 0, padding: "1.5rem", background: "transparent", fontSize: "0.85rem" }}
             >
               {activeSnippet.code}
             </SyntaxHighlighter>
          </div>
       </div>
    </div>
  );
}
