"use client";

import React from "react";
import { Sparkles, Download, Layers, ShieldCheck, Zap } from "lucide-react";

interface HeroProps {
  onScrollToConfig: () => void;
  onScrollToGuide: () => void;
}

export function Hero({ onScrollToConfig, onScrollToGuide }: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-600/10 blur-[130px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm font-medium mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>Stremio & Nuvio İçin Otomatik Türkçe Meta</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          Dizi ve Filmlerin Konuları{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400">
            Artık Türkçe.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Torrent ve Cinemeta kaynaklı İngilizce dizi/film açıklamaları, türleri
          ve sezonluk bölüm özetleri <strong>Turkify</strong> ile anında Türkçe’ye
          çevrilir. Sıfır bekleme, akıllı önbellek ve kesintisiz akış.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onScrollToConfig}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-5 h-5" />
            <span>Hemen Yükle & Yapılandır</span>
          </button>

          <button
            onClick={onScrollToGuide}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 text-gray-200 hover:text-white font-medium text-sm sm:text-base border border-gray-800 flex items-center justify-center gap-2 transition-all"
          >
            <Layers className="w-5 h-5 text-gray-400" />
            <span>Nuvio Kurulum Rehberi</span>
          </button>
        </div>

        {/* Value props badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 max-w-3xl mx-auto pt-8 border-t border-gray-800/60">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/60">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white">Yüksek Hız</h4>
              <p className="text-xs text-gray-400">Supabase DB önbelleği ile &lt;50ms</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/60">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white">Torrent Uyumu</h4>
              <p className="text-xs text-gray-400">Orijinal ID ile tüm torrentler çalışır</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/60">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white">Tüm Bölümler</h4>
              <p className="text-xs text-gray-400">Sezon bölümlerinin tamamı Türkçe</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
