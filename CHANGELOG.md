# Changelog

All notable changes to the **Turkify** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.6] - 2026-10-22

### Added
- **TMDB Full Integration**:
  - Integrated official TMDB API (`TMDB_API_KEY`) across movies and TV series.
  - Enriched TV series with official Turkish season episode titles and synopses from TMDB.
  - Enriched movie and series cast lists with 15+ actors and character names from TMDB credits.

---

## [1.0.5] - 2026-10-22

### Changed
- **Balanced Smart Caching**:
  - Replaced aggressive `no-cache` with a 5-minute client cache (`public, max-age=300, stale-while-revalidate=3600`). Protects Vercel and Supabase quota while preventing 24-hour client stale lockups.

---

## [1.0.4] - 2026-10-22

### Fixed
- **Actor Photos & Full Cast Preservation**:
  - Preserved rich metadata properties (`moviedb_id`, `tvdb_id`, `trailers`, `trailerStreams`, `links`, `behaviorHints`, `status`, `country`) across cached reads. Nuvio now receives the TMDB movie/series ID (`moviedb_id`) and displays real actor headshots, photos, and full cast credits instead of generic letter badges.
- **Client Disk Cache Elimination**:
  - Set `Cache-Control: no-cache, no-store, must-revalidate` on all `/meta/...` endpoints. Android TV and Nuvio clients will always fetch fresh, complete Turkish metadata rather than caching partially translated responses on local disk.

### Added
- **Bilingual Documentation & Architecture Flow**:
  - Updated `README.md` with full Turkish documentation, features, installation guide, and Mermaid architectural workflow diagram.
  - Updated GitHub repository description to Turkish.

---

## [1.0.3] - 2026-10-22

### Changed
- **Client Cache Optimization**:
  - Lowered `max-age` in `Cache-Control` header from 24 hours to 30 minutes (`max-age=1800, stale-while-revalidate=86400`) on metadata endpoints so TV clients (Nuvio / Stremio) pick up newly translated episodes and cache updates promptly without requiring a manual app cache wipe.
- **Documentation & Keep-Alive Automation**:
  - Updated `README.md` with in-app catalog search and high-throughput batching capabilities.
  - Added Keep-Alive recurring cron job via `cron-job.org` running every 15 minutes to eliminate serverless cold starts.

---

## [1.0.2] - 2026-10-22

### Fixed
- **Episode Overviews 429 & Truncation Fix**:
  - Replaced concurrent individual HTTP calls in `batchTranslate` with delimiter chunking (`\n[[[TR_SEP]]]\n`). Combines up to 12 episode synopses into a single Google Translate request, eliminating HTTP 429 (Rate Limit) errors.
  - Eliminated arbitrary 30-episode cutoffs that previously caused Season 0 specials to consume batch limits and left Season 1+ episodes in English. Now translates up to 100 episodes seamlessly.
  - Implemented dynamic cache repair in `getTranslatedMetadata`: automatically detects English-language episode descriptions in cached items and re-translates them to Turkish on the fly.
- **Serverless Cache Persistence**:
  - Awaited Supabase upserts with safety timeout race in serverless route handlers to prevent Vercel Lambda premature container freezes from dropping uncompleted database writes.

### Added
- **Full Catalog Search Integration (`extra: [{ name: "search" }]`)**:
  - Added search support to movie and series catalogs in `manifest.json`.
  - Added `/[configuration]/catalog/[type]/[id]/[extra]` and `/catalog/[type]/[id]/[extra]` routes with query decoding for Nuvio & Stremio in-app search.
  - Searching titles (e.g., "Silo", "VisionQuest") inside Nuvio now queries Turkify's catalog directly, rendering Turkish descriptions and genres immediately.

---

## [1.0.0] - 2026-10-22

### Added
- **Stremio Addon Protocol v3 Implementation**:
  - `GET /manifest.json`: Standard manifest declaring `meta` resource for `movie` and `series` with `idPrefixes: ["tt"]`.
  - `GET /meta/:type/:id.json`: High-speed metadata endpoint returning translated Turkish titles, overviews, genres, and episodic descriptions.
  - Configurable manifest & meta endpoints (`/[configuration]/manifest.json`, `/[configuration]/meta/:type/:id.json`) supporting customized user preferences.
- **Smart Hybrid Translation & Metadata Engine**:
  - Built-in free translation engine leveraging Google Translate's client endpoint and MyMemory API fallback.
  - Native Turkish genre mapping dictionary translating all standard IMDb and TMDB movie/series genres into Turkish without network latency.
  - Optional TMDB integration (`TMDB_API_KEY`) for human-curated Turkish synopses and artwork.
  - Resilient Cinemeta fallback ensuring zero downtime if third-party services are unreachable.
  - Serverless-safe episode overview batch translation for TV series.
- **Supabase Caching Layer**:
  - PostgreSQL cache table `translated_meta` with automated index configuration.
  - In-memory fast cache fallback when Supabase credentials are not provided.
  - One-click migration script in `supabase/schema.sql`.
- **Modern Web Configurator (`/` & `/configure`)**:
  - One-click Stremio install button (`stremio://`).
  - Nuvio step-by-step setup guide and quick-copy manifest URL button.
  - Interactive Live Preview component demonstrating English vs. Turkish metadata comparisons.
  - Preference toggles for original title preservation and episodic overview translations.
- **Testing & Tooling**:
  - Automated test suite (`npm test`) verifying manifest validity, genre translation, single & batch text translation, and full movie/series metadata resolution.
  - Full Next.js production build verification.
