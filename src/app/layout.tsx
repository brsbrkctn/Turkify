import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://turkify-addon.vercel.app"),
  title: "Turkify — Stremio & Nuvio Türkçe Meta Eklentisi",
  description:
    "Stremio ve Nuvio için film, dizi ve bölüm açıklamalarını otomatik Türkçe'ye çevirip yüksek hızda sunan açık kaynak eklenti.",
  alternates: {
    canonical: "https://turkify-addon.vercel.app",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  keywords: [
    "stremio",
    "nuvio",
    "stremio türkçe eklenti",
    "nuvio türkçe eklenti",
    "stremio addon",
    "nuvio addon",
    "stremio türkçe meta",
    "türkçe film açıklamaları",
    "türkçe dizi özetleri",
    "turkify",
    "turkify addon",
    "stremio cinemeta türkçe",
    "tmdb türkçe",
  ],
  authors: [{ name: "Barış Berke Çetin", url: "https://github.com/brsbrkctn" }],
  creator: "Barış Berke Çetin",
  publisher: "Barış Berke Çetin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    creator: "@brsbrkctn",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Turkify",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Android, Android TV, Windows, macOS, Linux, iOS, Web",
  description:
    "Stremio ve Nuvio için film, dizi ve bölüm açıklamalarını otomatik Türkçe'ye çevirip yüksek hızda sunan açık kaynak eklenti.",
  url: "https://turkify-addon.vercel.app",
  image: "https://turkify-addon.vercel.app/logo.png",
  softwareVersion: "1.1.5",
  author: {
    "@type": "Person",
    name: "Barış Berke Çetin",
    url: "https://github.com/brsbrkctn",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Turkify nedir ve ne işe yarar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Turkify, Stremio ve Nuvio medya oynatıcılarında yabancı film ve dizilerin açıklamalarını, türlerini ve tüm sezonluk bölüm özetlerini otomatik olarak Türkçe'ye çevirip sunan yüksek hızlı bir meta eklentisidir.",
      },
    },
    {
      "@type": "Question",
      name: "Turkify Stremio ve Nuvio'ya nasıl kurulur?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Turkify web sitesindeki manifest bağlantısını kopyalayıp Stremio veya Nuvio uygulamasındaki Eklentiler menüsüne yapıştırarak tek tıkla kurabilirsiniz.",
      },
    },
    {
      "@type": "Question",
      name: "Eklenti sıralaması ve önceliği neden önemlidir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stremio ve Nuvio'da içerik detaylarının Türkçe görüntülenebilmesi için Turkify eklentisinin eklenti yöneticisinde Cinemeta'nın üstünde (en başta) yer alması önerilir.",
      },
    },
    {
      "@type": "Question",
      name: "Torrentio ve diğer akış eklentileriyle uyumlu mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. Turkify orijinal IMDb kimliklerini (tt-ID) ve isteğe bağlı orijinal İngilizce başlıkları koruduğu için Torrentio ve tüm debrid sağlayıcılarıyla %100 uyumludur.",
      },
    },
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Turkify",
  url: "https://turkify-addon.vercel.app",
  description:
    "Stremio ve Nuvio için film, dizi ve bölüm açıklamalarını otomatik Türkçe'ye çevirip yüksek hızda sunan açık kaynak eklenti.",
  inLanguage: "tr-TR",
  author: {
    "@type": "Person",
    name: "Barış Berke Çetin",
    url: "https://github.com/brsbrkctn",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}