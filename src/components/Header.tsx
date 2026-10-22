"use client";

import React from "react";
import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b border-slate-800/80 bg-[#070b14]/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-sky-950/40 border border-sky-500/30 bg-slate-900/80 flex items-center justify-center p-1 hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="Turkify Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-sky-200">
                Turkify
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                v1.0.8
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Stremio & Nuvio Türkçe Meta Sağlayıcısı
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/brsbrkctn/Turkify"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all shadow-sm hover:border-slate-700"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
