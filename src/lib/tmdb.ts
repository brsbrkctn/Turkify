/**
 * Optional TMDB integration for official Turkish movie/series metadata.
 * Requires TMDB_API_KEY in environment variables.
 */

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface TMDBResult {
  title?: string;
  originalTitle?: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  episodeOverviews?: Map<string, { title?: string; overview?: string }>;
}

export async function fetchTMDBMeta(
  type: "movie" | "series",
  imdbId: string
): Promise<TMDBResult | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const cleanId = imdbId.replace(/\.json$/, "");
    const findUrl = `${TMDB_BASE_URL}/find/${cleanId}?external_source=imdb_id&language=tr-TR&api_key=${apiKey}`;

    const res = await fetch(findUrl, { next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const data = await res.json();

    if (type === "movie" && data.movie_results?.length > 0) {
      const movie = data.movie_results[0];
      return {
        title: movie.title,
        originalTitle: movie.original_title,
        overview: movie.overview,
        posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
        backdropPath: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : undefined,
      };
    }

    if (type === "series" && data.tv_results?.length > 0) {
      const show = data.tv_results[0];
      return {
        title: show.name,
        originalTitle: show.original_name,
        overview: show.overview,
        posterPath: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : undefined,
        backdropPath: show.backdrop_path ? `https://image.tmdb.org/t/p/original${show.backdrop_path}` : undefined,
      };
    }

    return null;
  } catch (err) {
    console.warn(`[TMDB] Could not fetch data for ${imdbId}:`, err);
    return null;
  }
}
