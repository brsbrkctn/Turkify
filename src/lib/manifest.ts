import { AddonConfig, StremioManifest } from "./types";

export function getManifest(baseUrl?: string, config?: AddonConfig): StremioManifest {
  const origin = baseUrl || "https://turkify-addon.vercel.app";
  const showCatalogs = config?.enableCatalogs !== false;

  const catalogs = showCatalogs
    ? [
        {
          type: "movie",
          id: "top",
          name: "Turkify: Popüler Filmler (Türkçe)",
          extra: [
            { name: "search", isRequired: false },
            { name: "skip", isRequired: false },
          ],
        },
        {
          type: "series",
          id: "top",
          name: "Turkify: Popüler Diziler (Türkçe)",
          extra: [
            { name: "search", isRequired: false },
            { name: "skip", isRequired: false },
          ],
        },
      ]
    : [
        {
          type: "movie",
          id: "top",
          name: "Turkify: Film Arama",
          extra: [{ name: "search", isRequired: true }],
        },
        {
          type: "series",
          id: "top",
          name: "Turkify: Dizi Arama",
          extra: [{ name: "search", isRequired: true }],
        },
      ];

  return {
    id: "org.brsbrkctn.turkify",
    version: "1.1.2",
    name: "Turkify (Türkçe)",
    description:
      "Stremio ve Nuvio için film, dizi ve bölüm açıklamalarını otomatik Türkçe'ye çevirip sunan yüksek hızlı meta eklentisi.",
    logo: `${origin}/icon.png`,
    background: `${origin}/background.jpg`,
    resources: ["catalog", "meta"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs,
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  };
}
