import React from 'react';
import LayerPipeline from './LayerPipeline';
import MatchTypeBadge from './MatchTypeBadge';
import ConfidenceBar from './ConfidenceBar';

export interface DuplicateItem {
  name: string;
  lang: string;
  match_type: string;
  confidence: number;
}

export interface DeduplicateResponse {
  duplicates_found?: DuplicateItem[];
  matched_by_layer?: number;
  llm_calls_made?: boolean;
  summary?: {
    total_found: number;
    high_confidence: number;
    low_confidence: number;
  };
}

export default function DeduplicateUI({ response }: { response: DeduplicateResponse }) {
  if (!response || typeof response !== 'object' || !Array.isArray(response.duplicates_found)) return null;

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <LayerPipeline matchedLayer={response.matched_by_layer || 1} llmCallsMade={!!response.llm_calls_made} />
      
      <div className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden mt-6">
        <table className="w-full text-left">
          <thead className="bg-black/40 border-b border-white/5 uppercase text-[10px] tracking-widest text-gray-500 font-bold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Language</th>
              <th className="px-6 py-4">Match Type</th>
              <th className="px-6 py-4 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {response.duplicates_found.map((dup: DuplicateItem, i: number) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-white">{dup.name}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{dup.lang}</td>
                <td className="px-6 py-4">
                  <MatchTypeBadge type={dup.match_type} />
                </td>
                <td className="px-6 py-4 w-48 align-middle">
                  <div className="flex justify-end pr-4">
                    <ConfidenceBar score={dup.confidence} />
                  </div>
                </td>
              </tr>
            ))}
            {response.duplicates_found.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">No duplicates found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {response.summary && (
        <div className="mt-4 px-6 py-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
          <span className="text-amber-500 font-bold text-sm">
            Found {response.summary.total_found} duplicates
          </span>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-400">{response.summary.high_confidence} high confidence</span>
            <span className="text-amber-400">{response.summary.low_confidence} low confidence</span>
          </div>
        </div>
      )}
    </div>
  );
}
