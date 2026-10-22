import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://turkify-addon.vercel.app"),
  title: "Turkify — Stremio & Nuvio Türkçe Meta Eklentisi",
  description:
    "Stremio ve Nuvio için film, dizi ve bölüm açıklamalarını otomatik Türkçe'ye çevirip yüksek hızda sunan açık kaynak eklenti.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
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
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Turkify Logo" }],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Turkify — Stremio & Nuvio Türkçe Meta Eklentisi",
    description:
      "Stremio ve Nuvio içeriklerini otomatik Türkçe'ye çevirip sunan eklenti.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
