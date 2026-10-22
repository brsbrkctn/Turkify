import { StremioManifest } from "./types";

export function getManifest(baseUrl?: string): StremioManifest {
  const origin = baseUrl || "https://turkify.vercel.app";

  return {
    id: "org.brsbrkctn.turkify",
    version: "1.0.0",
    name: "Turkify (Türkçe Meta)",
    description:
      "Stremio ve Nuvio için film, dizi ve bölüm açıklamalarını otomatik Türkçe'ye çevirip sunan yüksek hızlı meta eklentisi.",
    logo: `${origin}/icon.svg`,
    background: `${origin}/background.jpg`,
    resources: ["meta"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: [],
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  };
}
