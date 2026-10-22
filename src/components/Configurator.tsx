"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, ExternalLink, Settings2, HelpCircle } from "lucide-react";
import { encodeConfig } from "@/lib/config-helper";

export function Configurator() {
  const [turkishTitle, setTurkishTitle] = useState(false);
  const [translateEpisodes, setTranslateEpisodes] = useState(true);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const isDefault = !turkishTitle && translateEpisodes;
  const configString = isDefault
    ? ""
    : encodeConfig({ turkishTitle, translateEpisodes });

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
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 blur-[80px] pointer-events-none rounded-full" />

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Eklenti Yapılandırması</h3>
            <p className="text-xs text-slate-400">
              Tercihlerinize göre manifest bağlantısı anında hazırlanır.
            </p>
          </div>
        </div>

        {/* Setting Options */}
        <div className="space-y-4 mb-8">
          {/* Setting 1: Title Display */}
          <div
            onClick={() => setTurkishTitle(!turkishTitle)}
            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer select-none group"
          >
            <div className="space-y-1 pr-2">
              <span className="text-sm font-semibold text-white block group-hover:text-sky-300 transition-colors">
                Orijinal Başlıkları Koru (Önerilen)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Film ve dizi isimleri orijinal İngilizce kalır (örn. <em>Inception</em>, <em>Breaking Bad</em>). Konu ve tüm bölüm özetleri Türkçe olur. Torrent ve stream eşleşmesinde en yüksek uyumu sağlar.
              </p>
            </div>

            {/* Switch Pill 1 */}
            <div className="shrink-0 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={!turkishTitle}
                onClick={(e) => {
                  e.stopPropagation();
                  setTurkishTitle(!turkishTitle);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                  !turkishTitle
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500"
                    : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    !turkishTitle ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Setting 2: Episode Overviews */}
          <div
            onClick={() => setTranslateEpisodes(!translateEpisodes)}
            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer select-none group"
          >
            <div className="space-y-1 pr-2">
              <span className="text-sm font-semibold text-white block group-hover:text-sky-300 transition-colors">
                Dizi Sezon & Bölüm Özetlerini Çevir
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dizilerin tüm sezonlarındaki tekil bölüm konularını ve açıklamalarını Türkçe olarak yükler.
              </p>
            </div>

            {/* Switch Pill 2 */}
            <div className="shrink-0 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={translateEpisodes}
                onClick={(e) => {
                  e.stopPropagation();
                  setTranslateEpisodes(!translateEpisodes);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                  translateEpisodes
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500"
                    : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    translateEpisodes ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Generated URL Box */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Eklenti Manifest Bağlantısı (Addon URL)
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-slate-800 focus-within:border-sky-500/50 transition-all">
            <input
              type="text"
              readOnly
              value={manifestUrl}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none px-2 font-mono truncate select-all"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            Nuvio için bu bağlantıyı kopyalayıp Nuvio eklenti ayarlarına yapıştırın.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={stremioInstallUrl}
            className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40 transition-all border border-sky-400/20 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Stremio'ya Otomatik Ekle</span>
          </a>

          <button
            onClick={handleCopy}
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all border border-slate-700 hover:border-slate-600"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Kopyala</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
