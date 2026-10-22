import { fetchCinemetaMeta } from "./cinemeta";
import { fetchTMDBMeta } from "./tmdb";
import { translateGenres } from "./genres";
import { translateText, batchTranslate } from "./translator";
import { getCachedMeta, saveCachedMeta } from "./supabase";
import { AddonConfig, MetaDetail, MetaVideo, CachedMetadata } from "./types";

/**
 * Checks if a text string is likely English and hasn't been translated to Turkish yet.
 */
function isLikelyEnglish(text?: string): boolean {
  if (!text || text.trim().length < 8) return false;
  // If it contains Turkish specific letters, it is definitely already Turkish
  if (/[çğıöşüÇĞİÖŞÜ]/.test(text)) return false;
  // If it contains common English structural words
  return /\b(the|and|with|from|after|before|when|into|their|about|while|which|where|this|that|they|have|been|during|discovers)\b/i.test(
    text
  );
}

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
      let cachedVideos = cached.videos;
      let needsCacheUpdate = false;

      // Check if cached series has any English episodes that were partially translated
      if (
        type === "series" &&
        cachedVideos &&
        cachedVideos.length > 0 &&
        config.translateEpisodes !== false
      ) {
        const englishVideos = cachedVideos.filter((v) =>
          isLikelyEnglish(v.overview || v.description)
        );

        if (englishVideos.length > 0) {
          const textsToTranslate = englishVideos.map(
            (v) => v.overview || v.description || ""
          );
          const translatedOverviews = await batchTranslate(textsToTranslate);

          cachedVideos = cachedVideos.map((v) => {
            const matchIndex = englishVideos.findIndex(
              (ev) =>
                ev.id === v.id ||
                (ev.season === v.season && ev.number === v.number)
            );
            if (matchIndex !== -1 && translatedOverviews[matchIndex]) {
              const trOverview = translatedOverviews[matchIndex];
              return {
                ...v,
                overview: trOverview,
                description: trOverview,
              };
            }
            return v;
          });
          needsCacheUpdate = true;
        }
      }

      if (needsCacheUpdate) {
        const updatedRecord: CachedMetadata = {
          ...cached,
          videos: cachedVideos,
          updated_at: new Date().toISOString(),
        };
        saveCachedMeta(updatedRecord).catch((err) =>
          console.warn(`[MetaProcessor] Background cache update failed for ${cleanId}:`, err)
        );
      }

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
          videos: cachedVideos,
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

  // 6. Handle Series Episodes (Fast delimiter batch translation for up to 100 episodes)
  let translatedVideos: MetaVideo[] | undefined = baseMeta.videos;
  const shouldTranslateEpisodes = config.translateEpisodes !== false;

  if (
    type === "series" &&
    baseMeta.videos &&
    baseMeta.videos.length > 0 &&
    shouldTranslateEpisodes
  ) {
    try {
      const allVideos = [...baseMeta.videos];
      const MAX_VIDEOS = 100;
      const videosToProcess = allVideos.slice(0, MAX_VIDEOS);
      const remainingVideos = allVideos.slice(MAX_VIDEOS);

      const episodesToTranslate = videosToProcess.map(
        (v) => v.overview || v.description || ""
      );

      const translatedOverviews = await batchTranslate(episodesToTranslate);

      const processedVideos = videosToProcess.map((v, idx) => {
        const trOverview = translatedOverviews[idx] || v.overview || v.description;
        return {
          ...v,
          overview: trOverview,
          description: trOverview,
        };
      });

      translatedVideos = [...processedVideos, ...remainingVideos];
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

  // Persist to Supabase with 2.5s race to avoid serverless freeze
  try {
    await Promise.race([
      saveCachedMeta(toCache),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2500)),
    ]);
  } catch (err) {
    console.warn(`[MetaProcessor] Cache persist note for ${cleanId}:`, err);
  }

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
