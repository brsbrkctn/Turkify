"use client";

import React from "react";
import { MonitorPlay, Smartphone, ArrowRight, CheckCircle2 } from "lucide-react";

export function NuvioGuide() {
  return (
    <section id="guide" className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-800/80">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Kurulum Rehberi</h3>
        <p className="text-sm text-slate-400">
          Turkify eklentisini Nuvio ve Stremio uygulamalarına saniyeler içinde ekleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nuvio Instructions */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between backdrop-blur-sm hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Nuvio Kurulumu</h4>
                <p className="text-xs text-slate-400">Android, TV ve Masaüstü</p>
              </div>
            </div>

            <ol className="space-y-4 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-sky-500/30">
                  1
                </span>
                <span>
                  Yukarıdaki <strong>Kopyala</strong> butonuna basarak eklenti URL'ini panonuza alın.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-sky-500/30">
                  2
                </span>
                <span>
                  Nuvio uygulamasını açın ve <strong>Ayarlar &gt; İçerik ve Keşif &gt; Eklentiler</strong> sekmesine gidin.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-sky-500/30">
                  3
                </span>
                <span>
                  <strong>"Addon URL"</strong> alanına kopyaladığınız linki yapıştırıp <strong>Ekle</strong> butonuna basın. En iyi deneyim için eklentiyi listenin en başına taşıyın!
                </span>
              </li>
            </ol>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Nuvio tüm Stremio eklenti formatlarını yerel olarak destekler.</span>
          </div>
        </div>

        {/* Stremio Instructions */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between backdrop-blur-sm hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <MonitorPlay className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Stremio Kurulumu</h4>
                <p className="text-xs text-slate-400">PC, Mac, Android TV & Web</p>
              </div>
            </div>

            <ol className="space-y-4 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-orange-500/30">
                  1
                </span>
                <span>
                  Yukarıdaki <strong>Stremio'ya Otomatik Ekle</strong> butonuna tıklayın. Stremio doğrudan açılacaktır.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-orange-500/30">
                  2
                </span>
                <span>
                  Stremio ekranında çıkan <strong>"Install" (Yükle)</strong> butonuna basarak eklentiyi hesabınıza kaydedin.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-orange-500/30">
                  3
                </span>
                <span>
                  İçeriklerin Türkçe görünmesi için Stremio eklenti yöneticisinde Turkify'ın Cinemeta'nın üstünde olduğundan emin olun.
                </span>
              </li>
            </ol>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Hesabınıza bir kez kurduğunuzda TV dahil tüm cihazlarınıza eşitlenir.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
