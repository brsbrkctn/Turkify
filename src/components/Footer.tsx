"use client";

import React from "react";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#070b14]/90 py-8 px-4 text-center mt-12">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain rounded" />
          <span className="font-semibold text-slate-200">Turkify</span>
          <span>• Açık Kaynak Türkçe Stremio & Nuvio Meta Eklentisi</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/brsbrkctn/Turkify"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <span>•</span>
          <span>
            Geliştirici:{" "}
            <a
              href="https://github.com/brsbrkctn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-200 hover:text-sky-400 font-medium transition-colors"
            >
              Barış Berke Çetin
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
