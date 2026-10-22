"use client";

import React, { useState } from "react";
import { Star, Tv, Clapperboard, CheckCircle2 } from "lucide-react";

export function LivePreview() {
  const [isTurkish, setIsTurkish] = useState(true);

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Canlı Önizleme</h3>
        <p className="text-sm text-slate-400">
          Turkify eklentisi yüklendiğinde Stremio veya Nuvio'da göreceğiniz fark:
        </p>

        {/* Toggle button */}
        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 mt-5 shadow-inner">
          <button
            onClick={() => setIsTurkish(false)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              !isTurkish
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🇬🇧 Cinemeta (İngilizce)
          </button>
          <button
            onClick={() => setIsTurkish(true)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              isTurkish
                ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🇹🇷 Turkify (Türkçe)
          </button>
        </div>
      </div>

      {/* Mock Stremio / Nuvio Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-black border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Background artwork simulation */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-sm pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80')",
          }}
        />

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
          {/* Poster */}
          <div className="w-36 sm:w-44 shrink-0 rounded-xl overflow-hidden shadow-xl border border-slate-800 bg-slate-900 aspect-[2/3] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80"
              alt="Poster"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 z-20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-600 text-white shadow">
              {isTurkish ? "DİZİ" : "SERIES"}
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                2008
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                <Star className="w-3 h-3 fill-amber-400" /> 9.5
              </span>
              <span className="text-slate-400">5 Sezon • 62 Bölüm</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Breaking Bad
              </h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(isTurkish
                  ? ["Suç", "Dram", "Gerilim"]
                  : ["Crime", "Drama", "Thriller"]
                ).map((genre) => (
                  <span
                    key={genre}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis / Description */}
            <div className="rounded-xl p-4 bg-black/40 border border-slate-800/80">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clapperboard className="w-3.5 h-3.5 text-sky-400" />
                {isTurkish ? "Dizi Konusu" : "Overview"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isTurkish
                  ? "Lise kimya öğretmeni Walter White'a ölümcül bir akciğer kanseri teşhisi konur. Ailesinin finansal geleceğini güvence altına almak için eski öğrencisi Jesse Pinkman ile birlikte metamfetamin üretip satmaya karar verir."
                  : "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future."}
              </p>
            </div>

            {/* Episode Preview */}
            <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-orange-400" />
                  {isTurkish ? "1. Sezon 1. Bölüm (Pilot)" : "Season 1 Episode 1 (Pilot)"}
                </span>
                <span className="text-sky-400 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isTurkish ? "Türkçe Açıklama" : "Original Metadata"}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                {isTurkish
                  ? "Walter, 50. yaş gününde ölümcül kanser olduğunu öğrenir ve ilk uyuşturucu laboratuvarını eski bir karavanda kurar."
                  : "Walter discovers he has stage-3 lung cancer and decides to partner with Jesse to cook meth in a used RV."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
