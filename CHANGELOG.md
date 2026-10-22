# Changelog

All notable changes to the **Turkify** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
