import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turkify — Stremio & Nuvio Türkçe Meta Eklentisi",
  description:
    "Stremio ve Nuvio için film, dizi ve bölüm açıklamalarını otomatik Türkçe'ye çevirip yüksek hızda sunan açık kaynak eklenti.",
  keywords: [
    "stremio",
    "nuvio",
    "addon",
    "eklenti",
    "türkçe",
    "meta",
    "çeviri",
    "dizi",
    "film",
  ],
  authors: [{ name: "Barış Berke Çetin", url: "https://github.com/brsbrkctn" }],
  openGraph: {
    title: "Turkify — Stremio & Nuvio Türkçe Meta Eklentisi",
    description:
      "Dizi ve filmlerin konularını, türlerini ve tüm bölüm özetlerini anında Türkçe'ye çevirir.",
    url: "https://turkify-addon.vercel.app",
    siteName: "Turkify",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turkify — Stremio & Nuvio Türkçe Meta Eklentisi",
    description:
      "Stremio ve Nuvio içeriklerini otomatik Türkçe'ye çevirip sunan eklenti.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-[#090a0f] text-gray-100 antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
