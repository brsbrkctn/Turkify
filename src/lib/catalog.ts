import { translateGenres } from "./genres";
import { batchTranslate } from "./translator";
import { getCachedMeta } from "./supabase";
import { fetchTMDBMeta, searchTMDB } from "./tmdb";
import { AddonConfig } from "./types";

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
 * Fetches and translates a catalog of popular titles or search results.
 * Prioritizes TMDB for razor-sharp search precision and crisp 4K/HD posters and backdrops.
 */
export async function getTranslatedCatalog(
  type: "movie" | "series",
  catalogId: string,
  skip: number = 0,
  search?: string,
  config?: AddonConfig
): Promise<{ metas: CatalogItem[] }> {
  try {
    // 1. If search is specified, use TMDB Search API for exact matching and verified IMDb IDs
    if (search && search.trim().length > 0) {
      const tmdbResults = await searchTMDB(type, search.trim());
      if (tmdbResults.length > 0) {
        if (config?.keepOriginalTitle !== false) {
          return { metas: tmdbResults };
        }
        return { metas: tmdbResults };
      }
    }

    // 2. Fetch popular catalog from Cinemeta
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

    // 3. Check Supabase cache and enrich with TMDB high-res visuals (replacing metahub screenshots)
    const enrichedItems = await Promise.all(
      rawItems.map(async (item: any) => {
        const cached = await getCachedMeta(item.id);

        let poster = cached?.poster || item.poster;
        let background = cached?.background || item.background;
        let name = cached?.title || item.name;
        let description = cached?.overview || item.description;

        // Upgrade poster and background from TMDB if enabled
        if (
          config?.enrichTmdbMedia !== false &&
          (!poster ||
            !background ||
            poster.includes("metahub.space") ||
            background.includes("metahub.space"))
        ) {
          try {
            const tmdb = await fetchTMDBMeta(type, item.id);
            if (tmdb?.posterPath) poster = tmdb.posterPath;
            if (tmdb?.backdropPath) background = tmdb.backdropPath;
            if (tmdb?.title && (!name || !cached?.title)) name = tmdb.title;
            if (tmdb?.overview && !cached?.overview) description = tmdb.overview;
          } catch (err) {
            console.warn(`[Catalog] TMDB visual enrich note for ${item.id}:`, err);
          }
        }

        const finalName =
          config?.keepOriginalTitle !== false ? item.name : name || item.name;

        return {
          raw: item,
          cached,
          poster,
          background,
          name: finalName,
          description,
        };
      })
    );

    // 4. For items without Turkish descriptions, batch translate them
    const unCachedDescriptions = enrichedItems
      .filter((ci) => !ci.cached && ci.description)
      .map((ci) => ci.description);

    let translatedDescriptions: string[] = [];
    if (unCachedDescriptions.length > 0) {
      try {
        translatedDescriptions = await batchTranslate(unCachedDescriptions);
      } catch (err) {
        console.warn("[Catalog] Batch translation error:", err);
      }
    }

    let descIdx = 0;
    const finalMetas: CatalogItem[] = enrichedItems.map(
      ({ raw, cached, poster, background, name, description }) => {
        let finalDesc = description;
        if (!cached && description && translatedDescriptions[descIdx]) {
          finalDesc = translatedDescriptions[descIdx++];
        }

        const genres = cached?.genres || translateGenres(raw.genres);

        return {
          id: raw.id,
          type: raw.type,
          name: name || raw.name,
          poster,
          background,
          description: finalDesc,
          genres,
          imdbRating: cached?.imdb_rating || raw.imdbRating,
          releaseInfo: cached?.release_info || raw.releaseInfo || raw.year,
        };
      }
    );

    return { metas: finalMetas };
  } catch (err) {
    console.error(`[Catalog] Error fetching catalog for ${type}:`, err);
    return { metas: [] };
  }
}
