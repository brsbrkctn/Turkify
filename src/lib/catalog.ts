import { translateGenres } from "./genres";
import { translateText } from "./translator";
import { getCachedMeta, saveCachedMeta } from "./supabase";
import { CachedMetadata, MetaDetail } from "./types";

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
 * Fetches and translates a catalog of popular titles from Cinemeta.
 */
export async function getTranslatedCatalog(
  type: "movie" | "series",
  catalogId: string,
  skip: number = 0
): Promise<{ metas: CatalogItem[] }> {
  try {
    const skipParam = skip > 0 ? `skip=${skip}` : "";
    const url = `${CINEMETA_URL}/catalog/${type}/top${skipParam ? `?${skipParam}` : ""}.json`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache catalog for 1 hour
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { metas: [] };
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.metas)) {
      return { metas: [] };
    }

    // Process top 15 items for lightning response speed
    const items = data.metas.slice(0, 20);

    const translatedMetas: CatalogItem[] = await Promise.all(
      items.map(async (item: any) => {
        // Check if already in Supabase
        const cached = await getCachedMeta(item.id);
        if (cached) {
          return {
            id: cached.id,
            type: cached.type,
            name: cached.original_title || cached.title,
            poster: cached.poster || item.poster,
            background: cached.background || item.background,
            description: cached.overview || item.description,
            genres: cached.genres || translateGenres(item.genres),
            imdbRating: cached.imdb_rating || item.imdbRating,
            releaseInfo: cached.release_info || item.releaseInfo,
          };
        }

        // Fast genre translation
        const trGenres = translateGenres(item.genres);

        return {
          id: item.id,
          type: item.type,
          name: item.name,
          poster: item.poster,
          background: item.background,
          description: item.description,
          genres: trGenres,
          imdbRating: item.imdbRating,
          releaseInfo: item.releaseInfo || item.year,
        };
      })
    );

    return { metas: translatedMetas };
  } catch (err) {
    console.error(`[Catalog] Error fetching catalog for ${type}:`, err);
    return { metas: [] };
  }
}
