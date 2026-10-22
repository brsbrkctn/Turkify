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
 * 1. Fetches base metadata from Cinemeta (ensures moviedb_id for actor photos, trailers, links).
 * 2. Checks Supabase cache for Turkish translations.
 * 3. On cache miss: translates overview, genres, episodes -> saves to Supabase -> returns merged meta.
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

  // 1. Fetch base metadata from Cinemeta
  // This provides full rich fields: moviedb_id (for Nuvio actor photos), tvdb_id, trailers, links, cast, videos
  const baseMeta = await fetchCinemetaMeta(type, cleanId);
  if (!baseMeta) {
    return { meta: null };
  }

  // 2. Check Supabase cache for existing translations
  try {
    const cached = await getCachedMeta(cleanId);
    if (cached) {
      let cachedVideos = cached.videos;
      let needsCacheUpdate = false;

      // Check if any episode in cachedVideos is still English
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
          console.warn(`[MetaProcessor] Cache update failed for ${cleanId}:`, err)
        );
      }

      // Merge baseMeta with cached translations so no rich fields (moviedb_id, trailers, actor photos) are stripped!
      const displayName =
        config.turkishTitle && cached.title
          ? cached.title
          : cached.original_title || baseMeta.name;

      // Merge videos: use baseMeta video structure (with thumbnails & tvdb_id) enriched with cached translations
      let mergedVideos: MetaVideo[] | undefined = baseMeta.videos;
      if (baseMeta.videos && cachedVideos) {
        mergedVideos = baseMeta.videos.map((bv) => {
          const cv = cachedVideos?.find(
            (cv) =>
              cv.id === bv.id ||
              (cv.season === bv.season &&
                (cv.number === bv.number || cv.episode === bv.episode))
          );
          if (cv && cv.overview) {
            return {
              ...bv,
              overview: cv.overview,
              description: cv.description || cv.overview,
            };
          }
          return bv;
        });
      }

      return {
        meta: {
          ...baseMeta,
          name: displayName,
          originalName: baseMeta.name,
          description: cached.overview || baseMeta.description,
          genres: cached.genres || translateGenres(baseMeta.genres),
          videos: mergedVideos,
        },
      };
    }
  } catch (err) {
    console.warn(`[MetaProcessor] Cache lookup error for ${cleanId}:`, err);
  }

  // 3. Cold Cache Miss: Check TMDB for native Turkish metadata
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

  // 7. Assemble final metadata & cache
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
