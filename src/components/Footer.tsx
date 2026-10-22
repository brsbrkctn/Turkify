"use client";

import React from "react";
import { Github, Heart, Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-800/80 bg-black/60 py-8 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-rose-500" />
          <span className="font-semibold text-gray-300">Turkify</span>
          <span>• Açık Kaynak Türkçe Stremio & Nuvio Meta Eklentisi</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/brsbrkctn/Turkify"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
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
              className="text-gray-300 hover:text-rose-400 font-medium transition-colors"
            >
              Barış Berke Çetin
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
