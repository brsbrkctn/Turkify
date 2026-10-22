import { MetaDetail } from "./types";

const CINEMETA_URL = "https://v3-cinemeta.strem.io";

/**
 * Fetches movie or series metadata from Stremio's Cinemeta API.
 */
export async function fetchCinemetaMeta(
  type: "movie" | "series",
  imdbId: string
): Promise<MetaDetail | null> {
  const cleanId = imdbId.replace(/\.json$/, "");
  const url = `${CINEMETA_URL}/meta/${type}/${cleanId}.json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "Turkify-Stremio-Addon/1.0",
      },
      next: { revalidate: 86400 }, // Cache on Next.js fetch cache for 24 hours
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Cinemeta error status ${res.status}`);
    }

    const data = await res.json();
    if (!data || !data.meta) return null;

    return data.meta as MetaDetail;
  } catch (err) {
    console.error(`[Cinemeta] Failed to fetch meta for ${type}/${cleanId}:`, err);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
