/**
 * TMDB integration for official Turkish movie/series metadata.
 * Fetches verified Turkish synopses, episode titles, overviews, and full cast with photos.
 */

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface TMDBCastMember {
  name: string;
  character?: string;
  profilePath?: string;
}

export interface TMDBResult {
  tmdbId?: number;
  title?: string;
  originalTitle?: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  cast?: TMDBCastMember[];
  episodesMap?: Map<string, { title?: string; overview?: string; stillPath?: string }>;
}

export async function fetchTMDBMeta(
  type: "movie" | "series",
  imdbId: string
): Promise<TMDBResult | null> {
  const apiKey = process.env.TMDB_API_KEY || "e37106e867ffbc3f2b8483f2f85c010b";
  if (!apiKey) return null;

  try {
    const cleanId = imdbId.replace(/\.json$/, "");
    const findUrl = `${TMDB_BASE_URL}/find/${cleanId}?external_source=imdb_id&language=tr-TR&api_key=${apiKey}`;

    const res = await fetch(findUrl, { next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const data = await res.json();

    if (type === "movie" && data.movie_results?.length > 0) {
      const movie = data.movie_results[0];
      const tmdbId = movie.id;

      let cast: TMDBCastMember[] = [];
      try {
        const creditsRes = await fetch(
          `${TMDB_BASE_URL}/movie/${tmdbId}/credits?language=tr-TR&api_key=${apiKey}`,
          { next: { revalidate: 86400 } }
        );
        if (creditsRes.ok) {
          const creditsData = await creditsRes.json();
          cast = (creditsData.cast || []).slice(0, 15).map((c: any) => ({
            name: c.name,
            character: c.character,
            profilePath: c.profile_path
              ? `https://image.tmdb.org/t/p/w276_and_h350_face${c.profile_path}`
              : undefined,
          }));
        }
      } catch (err) {
        console.warn(`[TMDB] Movie credits error for ${cleanId}:`, err);
      }

      return {
        tmdbId,
        title: movie.title,
        originalTitle: movie.original_title,
        overview: movie.overview,
        posterPath: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : undefined,
        backdropPath: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : undefined,
        cast,
      };
    }

    if (type === "series" && data.tv_results?.length > 0) {
      const show = data.tv_results[0];
      const tmdbId = show.id;

      let cast: TMDBCastMember[] = [];
      try {
        const creditsRes = await fetch(
          `${TMDB_BASE_URL}/tv/${tmdbId}/credits?language=tr-TR&api_key=${apiKey}`,
          { next: { revalidate: 86400 } }
        );
        if (creditsRes.ok) {
          const creditsData = await creditsRes.json();
          cast = (creditsData.cast || []).slice(0, 15).map((c: any) => ({
            name: c.name,
            character: c.character,
            profilePath: c.profile_path
              ? `https://image.tmdb.org/t/p/w276_and_h350_face${c.profile_path}`
              : undefined,
          }));
        }
      } catch (err) {
        console.warn(`[TMDB] Series credits error for ${cleanId}:`, err);
      }

      return {
        tmdbId,
        title: show.name,
        originalTitle: show.original_name,
        overview: show.overview,
        posterPath: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : undefined,
        backdropPath: show.backdrop_path
          ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
          : undefined,
        cast,
      };
    }

    return null;
  } catch (err) {
    console.warn(`[TMDB] Could not fetch data for ${imdbId}:`, err);
    return null;
  }
}

/**
 * Fetches Turkish episode information for a specific TV show season from TMDB.
 */
export async function fetchTMDBSeasonEpisodes(
  tmdbId: number,
  seasonNumber: number
): Promise<Map<number, { title?: string; overview?: string; stillPath?: string }>> {
  const map = new Map<number, { title?: string; overview?: string; stillPath?: string }>();
  const apiKey = process.env.TMDB_API_KEY || "e37106e867ffbc3f2b8483f2f85c010b";
  if (!apiKey || !tmdbId) return map;

  try {
    const url = `${TMDB_BASE_URL}/tv/${tmdbId}/season/${seasonNumber}?language=tr-TR&api_key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return map;

    const data = await res.json();
    if (Array.isArray(data.episodes)) {
      data.episodes.forEach((ep: any) => {
        map.set(ep.episode_number, {
          title: ep.name,
          overview: ep.overview,
          stillPath: ep.still_path
            ? `https://image.tmdb.org/t/p/w500${ep.still_path}`
            : undefined,
        });
      });
    }
  } catch (err) {
    console.warn(`[TMDB] Season ${seasonNumber} fetch error for show ${tmdbId}:`, err);
  }

  return map;
}

export interface TMDBSearchResult {
  id: string; // IMDb ID (tt...)
  type: "movie" | "series";
  name: string;
  poster?: string;
  background?: string;
  description?: string;
  releaseInfo?: string;
  imdbRating?: string;
}

/**
 * Searches TMDB for movies or series with high accuracy, returning verified IMDb IDs.
 */
export async function searchTMDB(
  type: "movie" | "series",
  query: string
): Promise<TMDBSearchResult[]> {
  const apiKey = process.env.TMDB_API_KEY || "e37106e867ffbc3f2b8483f2f85c010b";
  if (!apiKey || !query.trim()) return [];

  const endpoint = type === "series" ? "tv" : "movie";
  try {
    const url = `${TMDB_BASE_URL}/search/${endpoint}?query=${encodeURIComponent(
      query.trim()
    )}&language=tr-TR&api_key=${apiKey}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data.results) || data.results.length === 0) return [];

    const topResults = data.results.slice(0, 10);
    const mapped = await Promise.all(
      topResults.map(async (item: any) => {
        try {
          const extUrl = `${TMDB_BASE_URL}/${endpoint}/${item.id}/external_ids?api_key=${apiKey}`;
          const extRes = await fetch(extUrl, { next: { revalidate: 86400 } });
          if (!extRes.ok) return null;
          const extData = await extRes.json();
          if (!extData.imdb_id || !extData.imdb_id.startsWith("tt")) return null;

          const year = (item.release_date || item.first_air_date || "").slice(0, 4);
          const rating = item.vote_average ? String(item.vote_average.toFixed(1)) : undefined;

          return {
            id: extData.imdb_id,
            type,
            name: item.title || item.name || item.original_title || item.original_name,
            poster: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : undefined,
            background: item.backdrop_path
              ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
              : undefined,
            description: item.overview || undefined,
            releaseInfo: year || undefined,
            imdbRating: rating,
          };
        } catch {
          return null;
        }
      })
    );

    return mapped.filter((item): item is TMDBSearchResult => item !== null);
  } catch (err) {
    console.warn(`[TMDB] Search error for ${query}:`, err);
    return [];
  }
}
