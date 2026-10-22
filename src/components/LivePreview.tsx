"use client";

import React, { useState } from "react";
import { Star, Tv, Clapperboard, CheckCircle2 } from "lucide-react";

export function LivePreview() {
  const [isTurkish, setIsTurkish] = useState(true);

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Canlı Önizleme</h3>
        <p className="text-sm text-gray-400">
          Turkify eklentisi yüklendiğinde Stremio veya Nuvio'da göreceğiniz fark:
        </p>

        {/* Toggle button */}
        <div className="inline-flex p-1 rounded-xl bg-gray-900 border border-gray-800 mt-5">
          <button
            onClick={() => setIsTurkish(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isTurkish
                ? "bg-gray-800 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            🇬🇧 Cinemeta (İngilizce)
          </button>
          <button
            onClick={() => setIsTurkish(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isTurkish
                ? "bg-rose-600 text-white shadow-md shadow-rose-950"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            🇹🇷 Turkify (Türkçe)
          </button>
        </div>
      </div>

      {/* Mock Stremio / Nuvio Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-950 to-black border border-gray-800 overflow-hidden shadow-2xl">
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
          <div className="w-36 sm:w-44 shrink-0 rounded-xl overflow-hidden shadow-xl border border-gray-800 bg-gray-900 aspect-[2/3] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80"
              alt="Poster"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 z-20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
              {isTurkish ? "DİZİ" : "SERIES"}
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-white px-2 py-0.5 rounded bg-gray-800">
                2008
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                <Star className="w-3 h-3 fill-amber-400" /> 9.5
              </span>
              <span className="text-gray-400">5 Sezon • 62 Bölüm</span>
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
                    className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis / Description */}
            <div className="rounded-xl p-4 bg-black/40 border border-gray-800/80">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Clapperboard className="w-3.5 h-3.5 text-rose-400" />
                {isTurkish ? "Dizi Konusu" : "Overview"}
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {isTurkish
                  ? "Ameliyat edilemez akciğer kanseri teşhisi konan bir lise kimya öğretmeni, vefatından sonra ailesinin maddi geleceğini garanti altına almak için eski öğrencisiyle birlikte kaliteli metamfetamin üretip satmaya başlar."
                  : "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future."}
              </p>
            </div>

            {/* Episode sample */}
            <div className="rounded-xl p-3.5 bg-gray-900/50 border border-gray-800/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-rose-400 flex items-center gap-1">
                  <Tv className="w-3.5 h-3.5" />
                  {isTurkish ? "Sezon 1, Bölüm 1 (Pilot)" : "Season 1, Episode 1 (Pilot)"}
                </span>
                <span className="text-gray-500">58 dk</span>
              </div>
              <p className="text-xs text-gray-400">
                {isTurkish
                  ? "Walter White, 50. yaş gününde ölümcül bir kansere yakalandığını öğrenir ve ailesine para bırakmak için tehlikeli bir yola adım atar."
                  : "Walter White is diagnosed with stage III terminal lung cancer and makes an unlikely deal to secure his family's financial independence."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
