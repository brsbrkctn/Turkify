import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://akfnjozqjewiaxfcvgsf.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrZm5qb3pxamV3aWF4ZmN2Z3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MTg2NDUsImV4cCI6MjEwODE5NDY0NX0.DWUPBanll_IGRvBCfD_DJ_8uJCsFw9MeStK_Z-rYy8A";

const TMDB_API_KEY = "e37106e867ffbc3f2b8483f2f85c010b";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const DELIMITER = "\n[[[TR_SEP]]]\n";

function isLikelyEnglish(text) {
  if (!text || text.trim().length < 8) return false;
  if (/[çğıöşüÇĞİÖŞÜ]/.test(text)) return false;
  return /\b(the|and|with|from|after|before|when|into|their|about|while|which|where|this|that|they|have|been|during|discovers)\b/i.test(
    text
  );
}

async function batchTranslateChunk(texts) {
  if (texts.length === 0) return [];
  const combined = texts.join(DELIMITER);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(
    combined
  )}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const full = data[0].map((item) => item[0]).join("");
  const parts = full.split(/\[\[\[TR_SEP\]\]\]/).map((s) => s.trim());
  if (parts.length === texts.length) return parts;
  throw new Error("Split length mismatch");
}

async function batchTranslateAll(items) {
  const CHUNK_SIZE = 12;
  const results = new Array(items.length);
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE);
    try {
      const translated = await batchTranslateChunk(chunk);
      for (let j = 0; j < chunk.length; j++) {
        results[i + j] = translated[j];
      }
    } catch (err) {
      for (let j = 0; j < chunk.length; j++) {
        try {
          const singleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(
            chunk[j]
          )}`;
          const sRes = await fetch(singleUrl);
          const sData = await sRes.json();
          results[i + j] = sData[0].map((item) => item[0]).join("");
        } catch (e) {
          results[i + j] = chunk[j];
        }
      }
    }
  }
  return results;
}

async function fetchTMDBData(imdbId, type) {
  try {
    const findUrl = `${TMDB_BASE_URL}/find/${imdbId}?external_source=imdb_id&language=tr-TR&api_key=${TMDB_API_KEY}`;
    const res = await fetch(findUrl);
    if (!res.ok) return null;
    const data = await res.json();

    if (type === "movie" && data.movie_results?.length > 0) {
      const m = data.movie_results[0];
      const creditsRes = await fetch(
        `${TMDB_BASE_URL}/movie/${m.id}/credits?language=tr-TR&api_key=${TMDB_API_KEY}`
      );
      let cast = [];
      if (creditsRes.ok) {
        const cData = await creditsRes.json();
        cast = (cData.cast || []).slice(0, 15).map((c) => c.name);
      }
      return {
        tmdbId: m.id,
        title: m.title,
        overview: m.overview,
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : undefined,
        background: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : undefined,
        cast,
      };
    }

    if (type === "series" && data.tv_results?.length > 0) {
      const s = data.tv_results[0];
      const creditsRes = await fetch(
        `${TMDB_BASE_URL}/tv/${s.id}/credits?language=tr-TR&api_key=${TMDB_API_KEY}`
      );
      let cast = [];
      if (creditsRes.ok) {
        const cData = await creditsRes.json();
        cast = (cData.cast || []).slice(0, 15).map((c) => c.name);
      }
      return {
        tmdbId: s.id,
        title: s.name,
        overview: s.overview,
        poster: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : undefined,
        background: s.backdrop_path ? `https://image.tmdb.org/t/p/original${s.backdrop_path}` : undefined,
        cast,
      };
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function fetchTMDBSeason(tmdbId, seasonNum) {
  try {
    const url = `${TMDB_BASE_URL}/tv/${tmdbId}/season/${seasonNum}?language=tr-TR&api_key=${TMDB_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return new Map();
    const data = await res.json();
    const map = new Map();
    if (Array.isArray(data.episodes)) {
      data.episodes.forEach((ep) => {
        map.set(ep.episode_number, {
          title: ep.name,
          overview: ep.overview,
        });
      });
    }
    return map;
  } catch (err) {
    return new Map();
  }
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("=== TURKIFY FAST DB SYNC TO TMDB ===");
  const { data: items, error } = await supabase
    .from("translated_meta")
    .select("*");

  if (error) {
    console.error("Supabase read error:", error);
    return;
  }

  console.log(`Found ${items.length} total items in Supabase.`);

  let updatedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`[${i + 1}/${items.length}] Checking ${item.title} (${item.id})...`);

    // Skip Tagesschau or Tatort (news/endless soap) to keep sync lightning fast
    if (item.title === "Tagesschau" || item.title === "Tatort") {
      console.log(`Skipping endless show: ${item.title}`);
      continue;
    }

    const tmdb = await fetchTMDBData(item.id, item.type);
    let changed = false;
    let newTitle = item.title;
    let newOverview = item.overview;
    let newSource = item.source || "auto";
    let newCast = item.cast;
    let newPoster = item.poster;
    let newBackground = item.background;
    let newVideos = item.videos;

    if (tmdb) {
      if (tmdb.title && (!newTitle || isLikelyEnglish(newTitle))) {
        newTitle = tmdb.title;
        changed = true;
      }
      if (tmdb.overview && tmdb.overview.trim().length > 15 && (!newOverview || newSource !== "tmdb")) {
        newOverview = tmdb.overview.trim();
        newSource = "tmdb";
        changed = true;
      }
      if (tmdb.cast?.length > (newCast?.length || 0)) {
        newCast = tmdb.cast;
        changed = true;
      }
      if (tmdb.poster && !newPoster) {
        newPoster = tmdb.poster;
        changed = true;
      }
      if (tmdb.background && !newBackground) {
        newBackground = tmdb.background;
        changed = true;
      }

      // Handle Series Episodes
      if (item.type === "series" && newVideos && newVideos.length > 0) {
        // Cap to first 120 episodes
        const maxVideos = Math.min(newVideos.length, 120);
        const videosToProcess = newVideos.slice(0, maxVideos);
        const remainingVideos = newVideos.slice(maxVideos);

        const seasons = Array.from(new Set(videosToProcess.map((v) => v.season))).filter((s) => s > 0);
        const seasonMaps = new Map();

        // Fetch seasons in parallel
        await Promise.all(
          seasons.map(async (s) => {
            const map = await fetchTMDBSeason(tmdb.tmdbId, s);
            if (map.size > 0) seasonMaps.set(s, map);
          })
        );

        const stillNeedsGoogle = [];

        const processedVideos = videosToProcess.map((v, idx) => {
          const sMap = seasonMaps.get(v.season);
          const epNum = v.number ?? v.episode;
          const tmdbEp = epNum !== undefined ? sMap?.get(epNum) : undefined;

          let epTitle = v.name || v.title;
          let epOverview = v.overview || v.description;

          if (tmdbEp?.title && (!epTitle || isLikelyEnglish(epTitle))) {
            epTitle = tmdbEp.title;
            changed = true;
          }
          if (tmdbEp?.overview && tmdbEp.overview.trim().length > 5 && (!epOverview || isLikelyEnglish(epOverview))) {
            epOverview = tmdbEp.overview.trim();
            changed = true;
          }

          if (!epOverview || isLikelyEnglish(epOverview)) {
            stillNeedsGoogle.push({ index: idx, text: epOverview || epTitle || "" });
          }

          return {
            ...v,
            name: epTitle,
            title: epTitle,
            overview: epOverview,
            description: epOverview,
          };
        });

        if (stillNeedsGoogle.length > 0) {
          const validGoogleItems = stillNeedsGoogle.filter((item) => item.text && item.text.trim().length > 5);
          if (validGoogleItems.length > 0) {
            try {
              const texts = validGoogleItems.map((item) => item.text);
              const trResults = await batchTranslateAll(texts);
              validGoogleItems.forEach((item, i) => {
                if (trResults[i]) {
                  processedVideos[item.index].overview = trResults[i];
                  processedVideos[item.index].description = trResults[i];
                  changed = true;
                }
              });
            } catch (err) {
              console.warn(`Translation fallback note for ${item.title}:`, err.message);
            }
          }
        }

        newVideos = [...processedVideos, ...remainingVideos];
      }
    }

    if (changed) {
      console.log(` -> UPDATED ${item.title} (${item.id}) with TMDB data`);
      const { error: updErr } = await supabase
        .from("translated_meta")
        .update({
          title: newTitle,
          overview: newOverview,
          source: newSource,
          cast: newCast,
          poster: newPoster,
          background: newBackground,
          videos: newVideos,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      if (updErr) {
        console.error(`Failed to update ${item.id}:`, updErr.message);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`=== FAST SYNC COMPLETE: ${updatedCount} items updated with TMDB official data ===`);
}

main().catch(console.error);
