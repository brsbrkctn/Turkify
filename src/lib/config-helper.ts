import { AddonConfig } from "./types";

export function parseConfig(configParam?: string): AddonConfig {
  if (!configParam) return {};

  try {
    // 1. Try decoding Base64 JSON
    const decoded = Buffer.from(configParam, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (typeof parsed === "object" && parsed !== null) {
      return {
        turkishTitle: Boolean(parsed.turkishTitle),
        translateEpisodes: parsed.translateEpisodes !== false,
      };
    }
  } catch {
    // Not base64 JSON, try parsing URL search string
  }

  try {
    const params = new URLSearchParams(configParam);
    return {
      turkishTitle: params.get("turkishTitle") === "true",
      translateEpisodes: params.get("translateEpisodes") !== "false",
    };
  } catch {
    return {};
  }
}

export function encodeConfig(config: AddonConfig): string {
  const json = JSON.stringify(config);
  return Buffer.from(json).toString("base64url");
}
