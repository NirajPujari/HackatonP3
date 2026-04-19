"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Database, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [cacheCount, setCacheCount] = useState<number | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/cache/stats");
        if (res.ok) {
          const data = await res.json();
          setCacheCount(data.total_cached_entries);
        }
      } catch (e) {
        console.error("Could not fetch cache stats", e);
      }
    };
    fetchStats();
  }, [pathname]);

  const links = [
    { label: "Home", href: "/" },
    { label: "The Problem", href: "/the-problem" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "The Agent", href: "/the-agent" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f1117]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Activity className="w-5 h-5 text-black" />
          </div>
          <Link href="/" className="text-lg font-black tracking-tight uppercase text-white">
            DataDock <span className="text-amber-500">Intelligence</span>
          </Link>
        </div>

        {/* Center: Links (Desktop) */}
        <nav className="hidden md:flex gap-8 items-center">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  isActive ? "text-amber-500 border-b-2 border-amber-500 pb-1" : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Status (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">API Online</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
              Cache: <span className="text-amber-500">{cacheCount !== null ? cacheCount : "..."}</span>
            </span>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0f1117] border-b border-white/5 py-4 px-6 flex flex-col gap-4 shadow-xl">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`text-sm font-bold uppercase tracking-wider py-2 ${
                  isActive ? "text-amber-500" : "text-gray-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">API Online</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span>Cache: <span className="text-amber-500">{cacheCount !== null ? cacheCount : "..."}</span></span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
