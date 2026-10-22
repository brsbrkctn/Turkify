"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, ExternalLink, Settings2, HelpCircle } from "lucide-react";
import { encodeConfig } from "@/lib/config-helper";

export function Configurator() {
  const [keepOriginalTitle, setKeepOriginalTitle] = useState(true);
  const [translateEpisodes, setTranslateEpisodes] = useState(true);
  const [enrichTmdbMedia, setEnrichTmdbMedia] = useState(true);
  const [enableCatalogs, setEnableCatalogs] = useState(true);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const isDefault =
    keepOriginalTitle &&
    translateEpisodes &&
    enrichTmdbMedia &&
    enableCatalogs;

  const configString = isDefault
    ? ""
    : encodeConfig({
        keepOriginalTitle,
        translateEpisodes,
        enrichTmdbMedia,
        enableCatalogs,
      });

  const manifestUrl = origin
    ? isDefault
      ? `${origin}/manifest.json`
      : `${origin}/${configString}/manifest.json`
    : "https://turkify-addon.vercel.app/manifest.json";

  const stremioInstallUrl = manifestUrl.replace(/^https?:\/\//, "stremio://");

  const handleCopy = () => {
    navigator.clipboard.writeText(manifestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="configurator" className="max-w-2xl mx-auto px-4 py-8">
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:border-slate-700/80">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 blur-[80px] pointer-events-none rounded-full" />

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Eklenti Yapılandırması</h3>
            <p className="text-xs text-slate-400">
              Tercihlerinize göre manifest bağlantısı otomatik hazırlanır.
            </p>
          </div>
        </div>

        {/* Setting Options */}
        <div className="space-y-3.5 mb-8">
          {/* Option 1: Original Titles */}
          <div
            onClick={() => setKeepOriginalTitle(!keepOriginalTitle)}
            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200 active:scale-[0.99] cursor-pointer select-none group"
          >
            <div className="space-y-1 pr-2">
              <span className="text-sm font-semibold text-white block group-hover:text-sky-300 transition-colors">
                Orijinal Başlıkları Koru (Önerilen)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Film ve dizilerin ana adlarını İngilizce tutar (örn. <em>Breaking Bad</em>, <em>Inception</em>). Torrentio ve akış kaynaklarıyla %100 kusursuz eşleşme sağlar; tüm açıklamalar ve detaylar Türkçe sunulur.
              </p>
            </div>

            <div className="shrink-0 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={keepOriginalTitle}
                onClick={(e) => {
                  e.stopPropagation();
                  setKeepOriginalTitle(!keepOriginalTitle);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/30 active:scale-95 ${
                  keepOriginalTitle
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500"
                    : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    keepOriginalTitle ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Option 2: Episode Overviews */}
          <div
            onClick={() => setTranslateEpisodes(!translateEpisodes)}
            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200 active:scale-[0.99] cursor-pointer select-none group"
          >
            <div className="space-y-1 pr-2">
              <span className="text-sm font-semibold text-white block group-hover:text-sky-300 transition-colors">
                Dizi Bölüm Konularını Çevir (Önerilen)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dizilerin tüm sezonlarındaki tekil bölüm adlarını ve bölüm özetlerini Türkçe olarak yükler. Kapatıldığında yalnızca ana dizi konusu çevrilir.
              </p>
            </div>

            <div className="shrink-0 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={translateEpisodes}
                onClick={(e) => {
                  e.stopPropagation();
                  setTranslateEpisodes(!translateEpisodes);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/30 active:scale-95 ${
                  translateEpisodes
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500"
                    : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    translateEpisodes ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Option 3: Rich TMDB Media & Cast */}
          <div
            onClick={() => setEnrichTmdbMedia(!enrichTmdbMedia)}
            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200 active:scale-[0.99] cursor-pointer select-none group"
          >
            <div className="space-y-1 pr-2">
              <span className="text-sm font-semibold text-white block group-hover:text-sky-300 transition-colors">
                Gelişmiş Görsel ve Oyuncu Detayları (Önerilen)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cinemeta'nın temel verileri yerine yüksek çözünürlüklü afişler, net arka plan görselleri ve fotoğraflı oyuncu kadrosunu dahil eder.
              </p>
            </div>

            <div className="shrink-0 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={enrichTmdbMedia}
                onClick={(e) => {
                  e.stopPropagation();
                  setEnrichTmdbMedia(!enrichTmdbMedia);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/30 active:scale-95 ${
                  enrichTmdbMedia
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500"
                    : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    enrichTmdbMedia ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Option 4: Popular Catalogs */}
          <div
            onClick={() => setEnableCatalogs(!enableCatalogs)}
            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200 active:scale-[0.99] cursor-pointer select-none group"
          >
            <div className="space-y-1 pr-2">
              <span className="text-sm font-semibold text-white block group-hover:text-sky-300 transition-colors">
                Popüler İçerik Katalogları (Önerilen)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stremio ve Nuvio ana sayfanıza, konuları ve detayları Türkçe'ye çevrilmiş güncel film ve dizi keşif kataloglarını ekler.
              </p>
            </div>

            <div className="shrink-0 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={enableCatalogs}
                onClick={(e) => {
                  e.stopPropagation();
                  setEnableCatalogs(!enableCatalogs);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/30 active:scale-95 ${
                  enableCatalogs
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500"
                    : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    enableCatalogs ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Generated URL Box with Single Kopyala Button */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Eklenti Manifest Bağlantısı (Addon URL)
          </label>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-slate-800 focus-within:border-sky-500/50 transition-all duration-200">
            <input
              type="text"
              readOnly
              value={manifestUrl}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none px-2 font-mono truncate select-all"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 px-4 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 border border-sky-500/30 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 animate-icon-pop" />
                  <span className="text-emerald-400">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-sky-400" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            Nuvio veya Web için yukarıdaki bağlantıyı kopyalayıp eklenti ekleme alanına yapıştırın.
          </p>
        </div>

        {/* Action Button - Single Primary CTA with sweeping light animation */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={stremioInstallUrl}
            className="group relative overflow-hidden w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40 transition-all duration-200 border border-sky-400/20 transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {/* Shimmer reflection */}
            <span className="absolute inset-0 w-1/3 h-full bg-white/20 blur-sm pointer-events-none -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[350%] transition-transform duration-700 ease-out" />
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" />
            <span>Stremio'ya Otomatik Ekle</span>
          </a>
        </div>
      </div>
    </div>
  );
}