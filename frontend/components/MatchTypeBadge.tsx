import React from 'react';

export default function MatchTypeBadge({ type }: { type: string }) {
  let colors = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  if (type === "exact") colors = "bg-sky-500/10 text-sky-400 border-sky-500/20";
  else if (type === "semantic") colors = "bg-purple-500/10 text-purple-400 border-purple-500/20";
  else if (type === "transliteration") colors = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-widest ${colors}`}>
      {type}
    </span>
  );
}
