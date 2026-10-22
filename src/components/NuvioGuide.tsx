"use client";

import React from "react";
import { MonitorPlay, Smartphone, ArrowRight, CheckCircle2 } from "lucide-react";

export function NuvioGuide() {
  return (
    <section id="guide" className="max-w-4xl mx-auto px-4 py-12 border-t border-gray-800/80">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-white mb-2">Kurulum Rehberi</h3>
        <p className="text-sm text-gray-400">
          Turkify eklentisini Nuvio ve Stremio uygulamalarına saniyeler içinde ekleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nuvio Instructions */}
        <div className="rounded-2xl bg-gray-900/60 border border-gray-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Nuvio Kurulumu</h4>
                <p className="text-xs text-gray-400">Android, TV ve Masaüstü</p>
              </div>
            </div>

            <ol className="space-y-4 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Yukarıdaki <strong>Manifest Bağlantısını Kopyala</strong> butonuna basarak URL'i panonuza alın.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Nuvio uygulamasını açın ve <strong>Ayarlar (Settings) &gt; İçerik ve Keşif (Content & Discovery) &gt; Eklentiler (Addons)</strong> sekmesine gidin.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>"Addon URL"</strong> alanına kopyaladığınız linki yapıştırın ve <strong>Ekle</strong> butonuna basın. Artık içerikleriniz Türkçe!
                </span>
              </li>
            </ol>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Nuvio tüm Stremio eklenti formatlarını standart olarak destekler.</span>
          </div>
        </div>

        {/* Stremio Instructions */}
        <div className="rounded-2xl bg-gray-900/60 border border-gray-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                <MonitorPlay className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Stremio Kurulumu</h4>
                <p className="text-xs text-gray-400">PC, Mac, Android TV & Web</p>
              </div>
            </div>

            <ol className="space-y-4 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Yukarıdaki <strong>Stremio'ya Otomatik Ekle</strong> butonuna tıklayın. Stremio uygulamanız otomatik olarak açılacaktır.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Ekrana gelen onay penceresinde <strong>Yükle (Install)</strong> butonuna tıklayın.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Eğer web sürümünü (web.stremio.com) kullanıyorsanız, Eklentiler sekmesindeki arama çubuğuna Turkify manifest URL'ini yapıştırmanız yeterlidir.
                </span>
              </li>
            </ol>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Stremio hesabınıza senkronize edilir, TV dahil tüm cihazlarınıza geçer.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
