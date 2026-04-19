import React from 'react';

export interface WarmupResponse {
  unique_names?: number;
  target_languages?: string[];
  already_cached?: number;
  newly_translated?: number;
  failed?: number;
}

export default function CacheWarmupUI({ response }: { response: WarmupResponse }) {
  if (!response || response.unique_names === undefined) return null;

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden mt-6 shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-[#0b0c10] border-b border-white/5 uppercase text-[10px] tracking-widest text-gray-500 font-bold">
            <tr>
              <th className="px-6 py-4">Metric</th>
              <th className="px-6 py-4 text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/5">
              <td className="px-6 py-4 text-sm text-gray-300 font-semibold tracking-wide">Unique Names</td>
              <td className="px-6 py-4 text-right font-mono text-white tracking-widest">{response.unique_names}</td>
            </tr>
            <tr className="hover:bg-white/5">
              <td className="px-6 py-4 text-sm text-gray-300 font-semibold tracking-wide">Languages Targeted</td>
              <td className="px-6 py-4 text-right font-mono text-white tracking-widest">{response.target_languages?.length || 0}</td>
            </tr>
            <tr className="hover:bg-white/5">
              <td className="px-6 py-4 text-sm text-gray-300 font-semibold tracking-wide flex items-center gap-2">Already Cached <div className="w-2 h-2 rounded-full bg-emerald-500/50" /></td>
              <td className="px-6 py-4 text-right font-mono text-emerald-400 tracking-widest">{response.already_cached}</td>
            </tr>
            <tr className="hover:bg-white/5">
              <td className="px-6 py-4 text-sm text-gray-300 font-semibold tracking-wide flex items-center gap-2">Newly Translated <div className="w-2 h-2 rounded-full bg-sky-500/50" /></td>
              <td className="px-6 py-4 text-right font-mono text-sky-400 tracking-widest">{response.newly_translated}</td>
            </tr>
            <tr className="hover:bg-white/5">
              <td className="px-6 py-4 text-sm text-gray-300 font-semibold tracking-wide flex items-center gap-2">Failed <div className="w-2 h-2 rounded-full bg-red-500/50" /></td>
              <td className="px-6 py-4 text-right font-mono text-red-400 tracking-widest">{response.failed}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
