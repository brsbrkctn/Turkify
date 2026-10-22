import { AddonConfig } from "./types";

export function parseConfig(configParam?: string): AddonConfig {
  if (!configParam) return {};

  try {
    let decoded = "";
    if (typeof window !== "undefined") {
      let b64 = configParam.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      decoded = decodeURIComponent(escape(atob(b64)));
    } else {
      decoded = Buffer.from(configParam, "base64url").toString("utf-8");
    }

    const parsed = JSON.parse(decoded);
    if (typeof parsed === "object" && parsed !== null) {
      return {
        keepOriginalTitle:
          parsed.keepOriginalTitle !== undefined
            ? Boolean(parsed.keepOriginalTitle)
            : parsed.turkishTitle !== undefined
            ? !Boolean(parsed.turkishTitle)
            : true,
        translateEpisodes: parsed.translateEpisodes !== false,
        enrichTmdbMedia: parsed.enrichTmdbMedia !== false,
        enableCatalogs: parsed.enableCatalogs !== false,
      };
    }
  } catch {
    // Not base64 JSON, try parsing URL search string
  }

  try {
    const params = new URLSearchParams(configParam);
    const hasKot = params.has("keepOriginalTitle");
    const hasTt = params.has("turkishTitle");
    return {
      keepOriginalTitle: hasKot
        ? params.get("keepOriginalTitle") !== "false"
        : hasTt
        ? params.get("turkishTitle") !== "true"
        : true,
      translateEpisodes: params.get("translateEpisodes") !== "false",
      enrichTmdbMedia: params.get("enrichTmdbMedia") !== "false",
      enableCatalogs: params.get("enableCatalogs") !== "false",
    };
  } catch {
    return {};
  }
}

export function encodeConfig(config: AddonConfig): string {
  const json = JSON.stringify(config);
  if (typeof window !== "undefined") {
    return btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  return Buffer.from(json).toString("base64url");
}
