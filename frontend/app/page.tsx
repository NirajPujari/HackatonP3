"use client";

import { Server } from "lucide-react";
import EndpointCard from "@/components/EndpointCard";

interface EndpointInfo {
  method: "GET" | "POST";
  path: string;
  description: string;
  defaultBody?: string;
}

const endpoints: EndpointInfo[] = [
  {
    method: "GET",
    path: "/api/db/raw-data",
    description: "Fetch raw, unprocessed data directly from the raw_data collection.",
  },
  {
    method: "GET",
    path: "/api/db/data",
    description: "Fetch cleaned and normalized data from the primary data collection.",
  },
  {
    method: "POST",
    path: "/api/normalize/",
    description: "Triggers the background normalization process. Clears target and refills from raw.",
  },
  {
    method: "POST",
    path: "/api/translate/",
    description: "Translates a specific word across all supported system languages.",
    defaultBody: JSON.stringify({ word: "Apple" }, null, 2),
  },
  {
    method: "POST",
    path: "/api/deduplicate/",
    description: "Runs the AI deduplication agent to find cross-language duplicates for a word.",
    defaultBody: JSON.stringify({ word: "Apple" }, null, 2),
  },
  {
    method: "GET",
    path: "/api/health",
    description: "Check the status and connectivity of the backend API system.",
  },
  {
    method: "POST",
    path: "/api/cache/warmup",
    description: "Warmup Translation Cache. Pre-translates all normalized inputs.",
  },
  {
    method: "GET",
    path: "/api/cache/stats",
    description: "Get Cache Coverage Statistics.",
  },
];

export default function Home() {
  const baseUrl="http://localhost:8000";

  return (
    <div className="min-h-screen bg-[#0f1117] text-white selection:bg-amber-500/30 selection:text-amber-200">


      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Intro Section */}
        <section className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <Server className="w-3 h-3" />
            <span>Interactive Documentation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            API <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-gray-500">Documentation</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            A specialized toolset for exploring the Problem 3. Test normalization, translation, 
            and deduplication logic in real-time.
          </p>
        </section>

        {/* Endpoints List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Available Endpoints
            </h3>
            <span className="text-[10px] font-mono text-gray-600">
              COUNT: {endpoints.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {endpoints.map((endpoint, index) => (
              <EndpointCard
                key={index}
                method={endpoint.method}
                path={endpoint.path}
                description={endpoint.description}
                baseUrl={baseUrl}
                defaultBody={endpoint.defaultBody}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 pb-10 border-t border-white/5 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6 text-gray-500">
              <a href="#" className="hover:text-amber-500 transition-colors text-xs font-bold uppercase tracking-wider">Docs</a>
              <a href="#" className="hover:text-amber-500 transition-colors text-xs font-bold uppercase tracking-wider">GitHub</a>
              <a href="#" className="hover:text-amber-500 transition-colors text-xs font-bold uppercase tracking-wider">Changelog</a>
            </div>
            <p className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
              Build with Next.js 14 & Framer Motion • Hackaton OS
            </p>
          </div>
        </footer>
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_-20%,rgba(245,158,11,0.05),transparent)] opacity-50" />
    </div>
  );
}
