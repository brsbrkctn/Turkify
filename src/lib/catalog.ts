import { translateGenres } from "./genres";
import { batchTranslate } from "./translator";
import { getCachedMeta } from "./supabase";

const CINEMETA_URL = "https://v3-cinemeta.strem.io";

export interface CatalogItem {
  id: string;
  type: string;
  name: string;
  poster?: string;
  background?: string;
  description?: string;
  genres?: string[];
  imdbRating?: string;
  releaseInfo?: string;
}

/**
 * Fetches and translates a catalog of popular titles or search results from Cinemeta.
 */
export async function getTranslatedCatalog(
  type: "movie" | "series",
  catalogId: string,
  skip: number = 0,
  search?: string
): Promise<{ metas: CatalogItem[] }> {
  try {
    let url: string;
    if (search && search.trim().length > 0) {
      url = `${CINEMETA_URL}/catalog/${type}/top/search=${encodeURIComponent(
        search.trim()
      )}.json`;
    } else {
      const skipParam = skip > 0 ? `skip=${skip}` : "";
      url = `${CINEMETA_URL}/catalog/${type}/top${
        skipParam ? `?${skipParam}` : ""
      }.json`;
    }

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { metas: [] };
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.metas)) {
      return { metas: [] };
    }

    // Process top 20 items
    const rawItems = data.metas.slice(0, 20);

    // 1. Check which items are cached in Supabase
    const cachedItems = await Promise.all(
      rawItems.map(async (item: any) => ({
        raw: item,
        cached: await getCachedMeta(item.id),
      }))
    );

    // 2. For items not in Supabase with descriptions, batch translate them
    const unCachedDescriptions = cachedItems
      .filter((ci) => !ci.cached && ci.raw.description)
      .map((ci) => ci.raw.description);

    let translatedDescriptions: string[] = [];
    if (unCachedDescriptions.length > 0) {
      try {
        translatedDescriptions = await batchTranslate(unCachedDescriptions);
      } catch (err) {
        console.warn("[Catalog] Batch translation error:", err);
      }
    }

    let descIdx = 0;
    const finalMetas: CatalogItem[] = cachedItems.map(({ raw, cached }) => {
      if (cached) {
        return {
          id: cached.id,
          type: cached.type,
          name: cached.original_title || cached.title,
          poster: cached.poster || raw.poster,
          background: cached.background || raw.background,
          description: cached.overview || raw.description,
          genres: cached.genres || translateGenres(raw.genres),
          imdbRating: cached.imdb_rating || raw.imdbRating,
          releaseInfo: cached.release_info || raw.releaseInfo,
        };
      }

      const trGenres = translateGenres(raw.genres);
      let trDesc = raw.description;
      if (raw.description && translatedDescriptions[descIdx]) {
        trDesc = translatedDescriptions[descIdx++];
      }

      return {
        id: raw.id,
        type: raw.type,
        name: raw.name,
        poster: raw.poster,
        background: raw.background,
        description: trDesc,
        genres: trGenres,
        imdbRating: raw.imdbRating,
        releaseInfo: raw.releaseInfo || raw.year,
      };
    });

    return { metas: finalMetas };
  } catch (err) {
    console.error(`[Catalog] Error fetching catalog for ${type}:`, err);
    return { metas: [] };
  }
}
