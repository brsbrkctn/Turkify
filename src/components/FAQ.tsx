"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Turkify nedir ve ne işe yarar?",
    answer:
      "Turkify, Stremio ve Nuvio medya oynatıcılarında yabancı film ve dizilerin açıklamalarını, türlerini ve tüm sezonluk bölüm özetlerini otomatik olarak Türkçe'ye çevirip sunan yüksek hızlı, açık kaynaklı bir meta eklentisidir.",
  },
  {
    question: "Turkify Stremio ve Nuvio'ya nasıl kurulur?",
    answer:
      "Yapılandırma alanındaki 'Stremio'ya Otomatik Ekle' butonuna tıklayarak doğrudan uygulamaya aktarabilir ya da 'Nuvio Bağlantısını Kopyala' butonuna basarak Nuvio içindeki Ayarlar > İçerik ve Keşif > Eklentiler alanına yapıştırabilirsiniz.",
  },
  {
    question: "Eklenti sıralaması (Cinemeta üstüne alma) neden önemlidir?",
    answer:
      "Stremio ve Nuvio birden fazla meta sağlayıcısı yüklü olduğunda en üst sıradaki eklentiyi öncelikli kabul eder. Türkçe açıklamaları ve zengin afişleri görebilmek için uygulamanızın Eklentiler menüsünde Turkify'ı sürükleyerek Cinemeta'nın üstüne (1. sıraya) almanız önerilir.",
  },
  {
    question: "Torrentio ve diğer akış eklentileriyle uyumlu mu?",
    answer:
      "Evet, %100 uyumludur. Turkify sadece film/dizi bilgi ve özetlerini Türkçeleştirir. Orijinal IMDb kimliklerini (tt-ID) ve isteğe bağlı orijinal başlıkları koruduğu için Torrentio, CyberFlix ve tüm debrid sağlayıcılarıyla kesintisiz çalışır.",
  },
];

export function FAQ() {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0]));

  const toggleItem = (idx: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-800/80">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Sıkça Sorulan Sorular</span>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Merak Edilenler</h3>
        <p className="text-sm text-slate-400 mt-1">
          Turkify kullanımı, eklenti uyumluluğu ve kurulum hakkında hızlı yanıtlar.
        </p>
      </div>

      <div className="space-y-3 max-w-3xl mx-auto">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openSet.has(idx);
          const answerId = `faq-answer-${idx}`;

          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-colors duration-200 hover:border-slate-700"
            >
              <h4>
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="w-full flex items-start justify-between p-4 text-left font-semibold text-sm sm:text-base text-slate-200 hover:text-white transition-colors gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
                >
                  <span className="leading-snug">{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 mt-0.5 transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-180 text-sky-400" : ""
                    }`}
                  />
                </button>
              </h4>

              <div
                id={answerId}
                role="region"
                aria-labelledby={`faq-question-${idx}`}
                className={`px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 ${
                  isOpen ? "block animate-micro-fade" : "hidden"
                }`}
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
