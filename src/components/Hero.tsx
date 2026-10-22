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
      {/* Background ambient dual glow with slow organic breathing */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-sky-500/15 blur-[140px] -z-10 rounded-full pointer-events-none animate-ambient-sky" />
      <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-[350px] h-[250px] bg-orange-500/10 blur-[130px] -z-10 rounded-full pointer-events-none animate-ambient-orange" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs sm:text-sm font-medium mb-6 shadow-sm shadow-sky-950/20 animate-fade-up">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Stremio & Nuvio İçin Otomatik Türkçe Meta</span>
        </div>

        {/* Main Headline - Line break on 'Artık Türkçe.' */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.18] mb-6 animate-fade-up delay-100">
          Dizi ve Filmlerin Konuları
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-orange-400">
            Artık Türkçe.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal animate-fade-up delay-150">
          Torrent ve Cinemeta kaynaklı yabancı dizi/film açıklamaları, türleri
          ve sezonluk bölüm özetleri <strong>Turkify</strong> ile anında Türkçe’ye
          çevrilir. Sıfır bekleme, akıllı önbellek ve kesintisiz akış.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-200">
          <button
            onClick={onScrollToConfig}
            className="relative overflow-hidden w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-sky-950/50 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] border border-sky-400/20 group"
          >
            {/* Subtle light sweep reflection */}
            <span className="absolute inset-0 w-1/3 h-full bg-white/20 blur-sm pointer-events-none -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[350%] transition-transform duration-700 ease-out" />
            <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5 duration-200" />
            <span>Hemen Yükle & Yapılandır</span>
          </button>

          <button
            onClick={onScrollToGuide}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm sm:text-base border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 transition-all shadow-sm transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <Layers className="w-5 h-5 text-slate-400" />
            <span>Nuvio Kurulum Rehberi</span>
          </button>
        </div>

        {/* Value props badges with refined hover elevation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 max-w-3xl mx-auto pt-8 border-t border-slate-800/80 animate-fade-up delay-300">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-900/80 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-sky-950/30 group">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 transition-transform duration-200">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white">Yüksek Hız</h4>
              <p className="text-xs text-slate-400">Akıllı bulut önbelleği ile &lt;30ms</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-emerald-950/30 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform duration-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white">Torrent Uyumu</h4>
              <p className="text-xs text-slate-400">Orijinal ID ile tüm kaynaklar çalışır</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-orange-500/40 hover:bg-slate-900/80 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-orange-950/30 group">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 group-hover:scale-110 transition-transform duration-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white">Tüm Bölümler</h4>
              <p className="text-xs text-slate-400">Sezon bölümlerinin tamamı Türkçe</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}