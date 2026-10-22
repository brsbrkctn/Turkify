# Changelog

All notable changes to the **Turkify** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
