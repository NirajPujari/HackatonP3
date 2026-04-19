"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Play, Loader2, Info, Terminal } from "lucide-react";
import MethodBadge from "./MethodBadge";
import ResponsePanel from "./ResponsePanel";

interface EndpointCardProps {
  method: "GET" | "POST";
  path: string;
  description: string;
  baseUrl: string;
  defaultBody?: string;
}

const EndpointCard: React.FC<EndpointCardProps> = ({
  method,
  path,
  description,
  baseUrl,
  defaultBody = "{}",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [requestBody, setRequestBody] = useState(defaultBody);
  const [response, setResponse] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const handleTryItOut = async () => {
    setIsLoading(true);
    setResponse(null);
    setStatus(null);
    setResponseTime(null);

    const startTime = performance.now();
    const url = `${baseUrl}${path}`;

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (method === "POST" && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      
      const endTime = performance.now();
      
      setResponse(data);
      setStatus(res.status);
      setResponseTime(Math.round(endTime - startTime));
    } catch (err: unknown) {
      const endTime = performance.now();
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch";
      setResponse({ error: errorMessage });
      setStatus(0);
      setResponseTime(Math.round(endTime - startTime));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`group rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 ${
        isOpen 
          ? "bg-white/5 border-white/20 ring-1 ring-white/10" 
          : "bg-transparent border-white/5 hover:border-white/10"
      }`}
    >
      <div 
        className={`relative left-0 top-0 bottom-0 w-1 z-10 ${
          method === "GET" ? "bg-sky-500" : "bg-emerald-500"
        }`}
      />
      
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors"
      >
        <div className="flex items-center gap-4">
          <MethodBadge method={method} />
          <div className="flex flex-col">
            <span className="text-sm font-mono font-bold text-white tracking-tight">
              {path}
            </span>
            <span className="text-xs text-gray-400 mt-1 font-medium">
              {description}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-150 overflow-y-auto border-t border-white/5" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Default Headers Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Default Headers</span>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-xs text-gray-400 space-y-1">
              <div className="flex gap-2">
                <span className="text-sky-400">Content-Type:</span>
                <span>application/json</span>
              </div>
              <div className="flex gap-2">
                <span className="text-sky-400">Accept:</span>
                <span>application/json</span>
              </div>
            </div>
          </div>

          {/* Request Body Section for POST */}
          {method === "POST" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <Info className="w-3.5 h-3.5" />
                  <span>Request Payload (JSON)</span>
                </div>
                <span className="text-[10px] font-mono text-amber-500/80 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                  EDITABLE
                </span>
              </div>
              <div className="relative group/editor">
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm text-sky-200 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none shadow-inner"
                  spellCheck="false"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-start">
            <button
              onClick={handleTryItOut}
              disabled={isLoading}
              className={`relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 ${
                isLoading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                  : "bg-amber-500 text-black hover:bg-amber-400 hover:shadow-amber-500/20 border border-amber-400"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Try it out</span>
                </>
              )}
            </button>
          </div>

          {/* Response Section */}
          <ResponsePanel response={response} status={status} time={responseTime} />
        </div>
      </div>
    </div>
  );
};

export default EndpointCard;
