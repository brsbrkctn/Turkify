import { StremioManifest } from "./types";

export function getManifest(baseUrl?: string): StremioManifest {
  const origin = baseUrl || "https://turkify-addon.vercel.app";

  return {
    id: "org.brsbrkctn.turkify",
    version: "1.0.4",
    name: "Turkify (Türkçe)",
    description:
      "Stremio ve Nuvio için film, dizi ve bölüm açıklamalarını otomatik Türkçe'ye çevirip sunan yüksek hızlı meta eklentisi.",
    logo: `${origin}/icon.svg`,
    background: `${origin}/background.jpg`,
    resources: ["catalog", "meta"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: [
      {
        type: "movie",
        id: "top",
        name: "Turkify: Popüler Filmler",
        extra: [
          { name: "search", isRequired: false },
          { name: "skip", isRequired: false },
        ],
      },
      {
        type: "series",
        id: "top",
        name: "Turkify: Popüler Diziler",
        extra: [
          { name: "search", isRequired: false },
          { name: "skip", isRequired: false },
        ],
      },
    ],
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  };
}
