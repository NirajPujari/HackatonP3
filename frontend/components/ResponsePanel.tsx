"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Clock, Hash } from "lucide-react";

interface ResponsePanelProps {
  response: unknown;
  status: number | null;
  time: number | null;
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({ response, status, time }) => {
  const [copied, setCopied] = useState(false);

  if (!response && !status) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return "text-emerald-400";
    if (code >= 400) return "text-rose-400";
    return "text-amber-400";
  };

  return (
    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4 text-xs font-mono">
          {status && (
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500 uppercase">Status:</span>
              <span className={`font-bold ${getStatusColor(status)}`}>{status}</span>
            </div>
          )}
          {time !== null && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500 uppercase">Time:</span>
              <span className="text-sky-400 font-bold">{time}ms</span>
            </div>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-400 hover:bg-white/10 hover:text-white transition-all uppercase tracking-wider font-bold"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-2xl">
        <div className="max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <SyntaxHighlighter
            language="json"
            style={atomDark}
            customStyle={{
              margin: 0,
              padding: "1.25rem",
              fontSize: "0.85rem",
              lineHeight: "1.5",
              background: "transparent",
            }}
            codeTagProps={{
              className: "font-mono",
            }}
          >
            {JSON.stringify(response, null, 2)}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default ResponsePanel;
