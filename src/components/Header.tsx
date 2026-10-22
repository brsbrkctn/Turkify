"useclient";

import React from "react";
import { Github, Film, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b border-gray-800/80 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white">
                Turkify
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                v1.0
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Stremio & Nuvio Türkçe Meta Sağlayıcısı
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/brsbrkctn/Turkify"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-gray-900/80 hover:bg-gray-800 border border-gray-800 rounded-lg transition-all"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
