"use client";

import React from "react";

interface MethodBadgeProps {
  method: "GET" | "POST";
}

const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => {
  const styles = {
    GET: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    POST: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[method]}`}
    >
      {method}
    </span>
  );
};

export default MethodBadge;
