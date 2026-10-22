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
    : "https://turkify.vercel.app/manifest.json";

  const stremioInstallUrl = manifestUrl.replace(/^https?:\/\//, "stremio://");

  const handleCopy = () => {
    navigator.clipboard.writeText(manifestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="configurator" className="max-w-2xl mx-auto px-4 py-8">
      <div className="rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 p-6 sm:p-8 shadow-2xl shadow-black/80">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Eklenti Yapılandırması</h3>
            <p className="text-xs text-gray-400">
              Tercihlerinize göre manifest bağlantısı anında hazırlanır.
            </p>
          </div>
        </div>

        {/* Setting 1: Title Display */}
        <div className="space-y-5 mb-8">
          <label className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700/80 transition-all cursor-pointer">
            <div className="space-y-1">
              <span className="text-sm font-semibold text-white block">
                Orijinal Başlıkları Koru (Önerilen)
              </span>
              <p className="text-xs text-gray-400 leading-relaxed">
                Film ve dizi isimleri orijinal İngilizce kalır (örn. <em>Inception</em>, <em>Breaking Bad</em>). Konu ve tüm bölüm özetleri Türkçe olur. Torrent/stream eşleşmesinde en yüksek uyumu sağlar.
              </p>
            </div>
            <input
              type="checkbox"
              checked={!turkishTitle}
              onChange={(e) => setTurkishTitle(!e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-gray-700 bg-gray-800 text-rose-600 focus:ring-rose-500/30 accent-rose-600 cursor-pointer"
            />
          </label>

          {/* Setting 2: Episode Overviews */}
          <label className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700/80 transition-all cursor-pointer">
            <div className="space-y-1">
              <span className="text-sm font-semibold text-white block">
                Dizi Sezon & Bölüm Özetlerini Çevir
              </span>
              <p className="text-xs text-gray-400 leading-relaxed">
                Dizilerin tüm sezonlarındaki tekil bölüm konularını ve açıklamalarını Türkçe olarak yükler.
              </p>
            </div>
            <input
              type="checkbox"
              checked={translateEpisodes}
              onChange={(e) => setTranslateEpisodes(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-gray-700 bg-gray-800 text-rose-600 focus:ring-rose-500/30 accent-rose-600 cursor-pointer"
            />
          </label>
        </div>

        {/* Generated URL Box */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
            Eklenti Manifest Bağlantısı (Addon URL)
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-gray-800 focus-within:border-rose-500/50 transition-all">
            <input
              type="text"
              readOnly
              value={manifestUrl}
              className="w-full bg-transparent text-xs sm:text-sm text-gray-200 focus:outline-none px-2 font-mono truncate select-all"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 px-3.5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-gray-500 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Nuvio için bu bağlantıyı kopyalayıp Nuvio eklenti ayarlarına yapıştırın.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={stremioInstallUrl}
            className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Stremio'ya Otomatik Ekle</span>
          </a>

          <button
            onClick={handleCopy}
            className="px-5 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all border border-gray-700"
          >
            <Copy className="w-4 h-4 text-gray-400" />
            <span>Nuvio İçin Kopyala</span>
          </button>
        </div>
      </div>
    </div>
  );
}
