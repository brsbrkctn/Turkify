export interface MetaVideo {
  id: string;
  name?: string;
  title?: string;
  season: number;
  episode?: number;
  number?: number;
  overview?: string;
  description?: string;
  thumbnail?: string;
  released?: string;
  firstAired?: string;
  rating?: string;
  tvdb_id?: number;
}

export interface MetaDetail {
  id: string;
  type: "movie" | "series";
  name: string;
  originalName?: string;
  genres?: string[];
  poster?: string;
  background?: string;
  logo?: string;
  description?: string;
  releaseInfo?: string;
  year?: string | number;
  imdbRating?: string;
  runtime?: string;
  director?: string[];
  cast?: string[];
  videos?: MetaVideo[];
  trailers?: Array<{ source: string; type: string }>;
  behaviorHints?: {
    defaultVideoId?: string;
    hasScheduledVideos?: boolean;
  };
}

export interface StremioManifest {
  id: string;
  version: string;
  name: string;
  description: string;
  logo?: string;
  background?: string;
  resources: Array<string | { name: string; types: string[]; idPrefixes?: string[] }>;
  types: string[];
  idPrefixes?: string[];
  catalogs: any[];
  behaviorHints?: {
    configurable?: boolean;
    configurationRequired?: boolean;
  };
}

export interface AddonConfig {
  turkishTitle?: boolean;
  translateEpisodes?: boolean;
}

export interface CachedMetadata {
  id: string;
  type: string;
  title: string;
  original_title?: string;
  overview: string;
  genres: string[];
  videos?: MetaVideo[];
  poster?: string;
  background?: string;
  logo?: string;
  imdb_rating?: string;
  release_info?: string;
  runtime?: string;
  director?: string[];
  cast?: string[];
  source?: string;
  updated_at: string;
}
