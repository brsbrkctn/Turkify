import { fetchCinemetaMeta } from "./cinemeta";
import { fetchTMDBMeta, fetchTMDBSeasonEpisodes } from "./tmdb";
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
 * 1. Fetches base metadata from Cinemeta.
 * 2. Checks Supabase cache for existing Turkish translations.
 * 3. Enriches with TMDB for official Turkish synopses, episode names, and full cast.
 * 4. Falls back to Google Translate batch delimiter engine for missing texts.
 * 5. Returns complete metadata with moviedb_id and full cast.
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
  const baseMeta = await fetchCinemetaMeta(type, cleanId);
  if (!baseMeta) {
    return { meta: null };
  }

  // 2. Fetch TMDB data in parallel for rich cast, Turkish title & overview
  let tmdbData: Awaited<ReturnType<typeof fetchTMDBMeta>> = null;
  try {
    tmdbData = await fetchTMDBMeta(type, cleanId);
  } catch (err) {
    console.warn(`[MetaProcessor] TMDB fetch note for ${cleanId}:`, err);
  }

  const tmdbId = tmdbData?.tmdbId || (baseMeta as any).moviedb_id;

  // 3. Check Supabase cache for existing translations
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

      const displayName =
        config.turkishTitle && cached.title
          ? cached.title
          : cached.original_title || baseMeta.name;

      // Merge videos: use baseMeta video structure enriched with cached translations
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
              name: cv.title || cv.name || bv.name,
              title: cv.title || cv.name || bv.title,
              overview: cv.overview,
              description: cv.description || cv.overview,
            };
          }
          return bv;
        });
      }

      // Merge cast from TMDB if available (15+ actors instead of 3)
      const finalCast =
        tmdbData?.cast && tmdbData.cast.length > 0
          ? tmdbData.cast.map((c) => c.name)
          : cached.cast || baseMeta.cast;

      return {
        meta: {
          ...baseMeta,
          name: displayName,
          originalName: baseMeta.name,
          description: cached.overview || baseMeta.description,
          genres: cached.genres || translateGenres(baseMeta.genres),
          videos: mergedVideos,
          cast: finalCast,
          moviedb_id: tmdbId,
        },
      };
    }
  } catch (err) {
    console.warn(`[MetaProcessor] Cache lookup error for ${cleanId}:`, err);
  }

  // 4. Cold Cache Miss: Assemble Turkish Title & Overview
  let turkishTitle = baseMeta.name;
  let turkishOverview: string | null = null;
  let source = "cinemeta";

  if (tmdbData) {
    if (tmdbData.title) turkishTitle = tmdbData.title;
    if (tmdbData.overview && tmdbData.overview.trim().length > 10) {
      turkishOverview = tmdbData.overview.trim();
      source = "tmdb";
    }
  }

  // Fallback to Google Translate if TMDB had no Turkish overview
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

  // 6. Handle Series Episodes (TMDB official Turkish first -> Google Translate batch fallback)
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
      const MAX_VIDEOS = 120;
      const videosToProcess = allVideos.slice(0, MAX_VIDEOS);
      const remainingVideos = allVideos.slice(MAX_VIDEOS);

      // 6a. Try to populate from TMDB seasons if tmdbId is available
      const tmdbSeasonMaps = new Map<number, Map<number, { title?: string; overview?: string }>>();
      if (tmdbId) {
        const uniqueSeasons = Array.from(
          new Set(videosToProcess.map((v) => v.season))
        ).filter((s) => s > 0);

        await Promise.all(
          uniqueSeasons.map(async (s) => {
            const seasonMap = await fetchTMDBSeasonEpisodes(tmdbId, s);
            if (seasonMap.size > 0) {
              tmdbSeasonMaps.set(s, seasonMap);
            }
          })
        );
      }

      // Check which episodes got TMDB Turkish overview and which still need Google translation
      const needsGoogleTranslation: { index: number; text: string }[] = [];
      const intermediateVideos: MetaVideo[] = videosToProcess.map((v, idx) => {
        const sMap = tmdbSeasonMaps.get(v.season);
        const epNum = v.number ?? v.episode ?? (idx + 1);
        const tmdbEp = sMap?.get(epNum);

        let epTitle = tmdbEp?.title || v.name || v.title;
        let epOverview = tmdbEp?.overview || v.overview || v.description || "";

        // If TMDB had no overview or it's English, mark for Google batch translation
        if (!epOverview || isLikelyEnglish(epOverview)) {
          const rawText = v.overview || v.description || "";
          if (rawText.trim().length > 0) {
            needsGoogleTranslation.push({ index: idx, text: rawText });
          }
        }

        return {
          ...v,
          name: epTitle,
          title: epTitle,
          overview: epOverview,
          description: epOverview,
        };
      });

      // 6b. Run batch delimiter translation for any remaining English episodes
      if (needsGoogleTranslation.length > 0) {
        const texts = needsGoogleTranslation.map((item) => item.text);
        const trResults = await batchTranslate(texts);

        needsGoogleTranslation.forEach((item, i) => {
          const trText = trResults[i];
          if (trText) {
            intermediateVideos[item.index] = {
              ...intermediateVideos[item.index],
              overview: trText,
              description: trText,
            };
          }
        });
      }

      translatedVideos = [...intermediateVideos, ...remainingVideos];
    } catch (err) {
      console.warn(`[MetaProcessor] Episode batch translation error:`, err);
      translatedVideos = baseMeta.videos;
    }
  }

  // 7. Assemble final cast (TMDB 15+ actors preferred over Cinemeta 3 actors)
  const finalCast =
    tmdbData?.cast && tmdbData.cast.length > 0
      ? tmdbData.cast.map((c) => c.name)
      : baseMeta.cast;

  // 8. Assemble final metadata & cache
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
    poster: tmdbData?.posterPath || baseMeta.poster,
    background: tmdbData?.backdropPath || baseMeta.background,
    logo: baseMeta.logo,
    imdb_rating: baseMeta.imdbRating,
    release_info: baseMeta.releaseInfo || (baseMeta.year ? String(baseMeta.year) : undefined),
    runtime: baseMeta.runtime,
    director: baseMeta.director,
    cast: finalCast,
    source,
    updated_at: new Date().toISOString(),
  };

  // Persist to Supabase with safety timeout race
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
      cast: finalCast,
      moviedb_id: tmdbId,
    },
  };
}
