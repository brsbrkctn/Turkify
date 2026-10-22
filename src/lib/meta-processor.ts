import { fetchCinemetaMeta } from "./cinemeta";
import { fetchTMDBMeta } from "./tmdb";
import { translateGenres } from "./genres";
import { translateText, batchTranslate } from "./translator";
import { getCachedMeta, saveCachedMeta } from "./supabase";
import { AddonConfig, MetaDetail, MetaVideo, CachedMetadata } from "./types";

/**
 * Core metadata orchestration function.
 * Checks cache -> fetches Cinemeta & TMDB -> auto-translates -> caches & returns.
 */
export async function getTranslatedMetadata(
  type: "movie" | "series",
  rawId: string,
  config: AddonConfig = {}
): Promise<{ meta: MetaDetail | null }> {
  const cleanId = rawId.replace(/\.json$/, "").trim();

  // Validate IMDb ID format
  if (!cleanId.startsWith("tt")) {
    return { meta: null };
  }

  // 1. Check Supabase cache
  try {
    const cached = await getCachedMeta(cleanId);
    if (cached) {
      const displayName =
        config.turkishTitle && cached.title
          ? cached.title
          : cached.original_title || cached.title;

      return {
        meta: {
          id: cached.id,
          type: cached.type as "movie" | "series",
          name: displayName,
          originalName: cached.original_title,
          description: cached.overview,
          genres: cached.genres,
          videos: cached.videos,
          poster: cached.poster,
          background: cached.background,
          logo: cached.logo,
          imdbRating: cached.imdb_rating,
          releaseInfo: cached.release_info,
          runtime: cached.runtime,
          director: cached.director,
          cast: cached.cast,
        },
      };
    }
  } catch (err) {
    console.warn(`[MetaProcessor] Cache lookup error for ${cleanId}:`, err);
  }

  // 2. Fetch base data from Cinemeta
  const baseMeta = await fetchCinemetaMeta(type, cleanId);
  if (!baseMeta) {
    return { meta: null };
  }

  // 3. Check TMDB for native Turkish metadata
  let turkishTitle = baseMeta.name;
  let turkishOverview: string | null = null;
  let source = "cinemeta";

  try {
    const tmdbData = await fetchTMDBMeta(type, cleanId);
    if (tmdbData) {
      if (tmdbData.title) turkishTitle = tmdbData.title;
      if (tmdbData.overview && tmdbData.overview.trim().length > 10) {
        turkishOverview = tmdbData.overview.trim();
        source = "tmdb";
      }
    }
  } catch (err) {
    console.warn(`[MetaProcessor] TMDB fetch error for ${cleanId}:`, err);
  }

  // 4. If TMDB has no Turkish overview, auto-translate Cinemeta description
  if (!turkishOverview && baseMeta.description) {
    try {
      turkishOverview = await translateText(baseMeta.description);
      source = "google";
    } catch (err) {
      console.warn(`[MetaProcessor] Translation error for ${cleanId}:`, err);
      turkishOverview = baseMeta.description;
    }
  }

  // 5. Translate genres to Turkish
  const turkishGenres = translateGenres(baseMeta.genres);

  // 6. Handle Series Episodes (Batch translation for episode overviews with serverless safety limit)
  let translatedVideos: MetaVideo[] | undefined = baseMeta.videos;
  const shouldTranslateEpisodes = config.translateEpisodes !== false;

  if (type === "series" && baseMeta.videos && baseMeta.videos.length > 0 && shouldTranslateEpisodes) {
    try {
      // Limit to 30 episodes on first un-cached hit to strictly prevent Vercel 10s serverless timeout
      const MAX_BATCH_EPISODES = 30;
      const videosToProcess = baseMeta.videos.slice(0, MAX_BATCH_EPISODES);
      const remainingVideos = baseMeta.videos.slice(MAX_BATCH_EPISODES);

      const episodesToTranslate = videosToProcess.map(
        (v) => v.overview || v.description || ""
      );

      const nonEmpties = episodesToTranslate.filter((t) => t.trim().length > 0);
      if (nonEmpties.length > 0) {
        const translatedOverviews = await batchTranslate(episodesToTranslate, 5);

        const processedVideos = videosToProcess.map((v, idx) => {
          const trOverview = translatedOverviews[idx] || v.overview || v.description;
          return {
            ...v,
            overview: trOverview,
            description: trOverview,
          };
        });

        translatedVideos = [...processedVideos, ...remainingVideos];
      }
    } catch (err) {
      console.warn(`[MetaProcessor] Episode batch translation error:`, err);
      translatedVideos = baseMeta.videos;
    }
  }

  // 7. Assemble final metadata
  const finalOverview = turkishOverview || baseMeta.description || "";
  const originalTitle = baseMeta.name;

  const toCache: CachedMetadata = {
    id: cleanId,
    type,
    title: turkishTitle,
    original_title: originalTitle,
    overview: finalOverview,
    genres: turkishGenres,
    videos: translatedVideos,
    poster: baseMeta.poster,
    background: baseMeta.background,
    logo: baseMeta.logo,
    imdb_rating: baseMeta.imdbRating,
    release_info: baseMeta.releaseInfo || (baseMeta.year ? String(baseMeta.year) : undefined),
    runtime: baseMeta.runtime,
    director: baseMeta.director,
    cast: baseMeta.cast,
    source,
    updated_at: new Date().toISOString(),
  };

  // Asynchronously save to Supabase cache (don't block response)
  saveCachedMeta(toCache).catch((err) =>
    console.error(`[MetaProcessor] Failed to persist cache for ${cleanId}:`, err)
  );

  const displayName =
    config.turkishTitle && turkishTitle ? turkishTitle : originalTitle;

  return {
    meta: {
      ...baseMeta,
      name: displayName,
      originalName: originalTitle,
      description: finalOverview,
      genres: turkishGenres,
      videos: translatedVideos,
    },
  };
}
