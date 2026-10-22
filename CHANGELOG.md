# Changelog

All notable changes to the **Turkify** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.1] - 2026-10-22

### Added & Improved
- **Clean Transparent Logo & Multi-Resolution Favicons**:
  - Extracted the authentic transparent logo from the source asset and generated ultra-crisp 512x512 RGBA PNGs and multi-size `.ico` favicons (16x16, 32x32, 48x48), eliminating all dark square borders.
- **Zero-Layout-Shift Live Preview**:
  - Locked dimensions for the "DİZİ" / "SERIES" badge, synopsis paragraph, and episode preview boxes so toggling between Cinemeta and Turkify produces zero page jitter or vertical jumping.
- **Accurate Addon Descriptions**:
  - Re-labeled "Ana Sayfa Popüler Katalogları" to "Popüler İçerik Katalogları (Önerilen)", clarifying that it provides popular global movies/series translated into Turkish rather than local Turkish cinema.
  - Refined "Zengin Medya ve Oyuncular" to "Gelişmiş Görsel ve Oyuncu Detayları (Önerilen)", removing marketing claims and focusing on official high-res TMDB artwork and photo-backed cast.
- **Manifest Catalog Names Clarity**:
  - Manifest catalog labels updated to *"Turkify: Popüler Filmler (Türkçe)"* and *"Turkify: Popüler Diziler (Türkçe)"*.

---

## [1.1.0] - 2026-10-22

### Added & Improved
- **Official High-Res Transparent Favicon & Logo**:
  - Extracted and integrated the official 1830x1830 transparent PNG asset (`Favicon turkify.png`) as the official logo, browser favicon, and Stremio/Nuvio catalog icon, replacing compressed square artifacts.
- **Authentic Breaking Bad Live Preview**:
  - Integrated official Breaking Bad TMDB poster and backdrop imagery into the live interactive preview.
  - Centered poster, titles, ratings, and genre tags on mobile viewport for flawless responsive balance.
  - Added localized season and episode counts ("5 Seasons • 62 Episodes" on Cinemeta toggle).
- **Expanded & Verified Addon Configurator**:
  - Expanded configurator to 4 granular, fully-working settings (all enabled by default with `(Önerilen)` tags):
    1. *Orijinal Başlıkları Koru (Önerilen)*
    2. *Dizi Bölüm Konularını Çevir (Önerilen)*
    3. *Zengin Medya ve Oyuncular (Önerilen)*
    4. *Ana Sayfa Popüler Katalogları (Önerilen)*
  - Eliminated duplicate copy buttons: a single, dedicated copy button with instant feedback in the manifest URL bar, paired with the primary "Stremio'ya Otomatik Ekle" CTA.
  - Full end-to-end integration: dynamic manifest generation, catalog pruning, and safe Supabase cache query decoupling.
- **Copy & UI Refinement**:
  - Reformatted hero title with clean line break: *"Dizi ve Filmlerin Konuları <br /> Artık Türkçe."*.
  - Completely purged internal technical stack references ("Supabase", "Vercel") from all user-facing website copy and badges.

---

## [1.0.9] - 2026-10-22

### Added & Improved
- **Official Brand Identity & Favicon Integration**:
  - Integrated the official high-resolution Turkify globe/translation logo (`/logo.png`, `/icon.png`, `/app/icon.png`) as the website logo, browser favicon, and Stremio/Nuvio catalog icon.
  - Re-themed website visual identity with a refined Oceanic Midnight & Cyan/Sky Blue aesthetic with Sunset Coral accents (`#0284c7`, `#38bdf8`, `#ea580c`), perfectly matching the brand icon.
- **Fixed Configurator Client Crash**:
  - Fixed `ReferenceError: Buffer is not defined` crash in `config-helper.ts` by introducing safe browser-side base64url encoding for client components. Toggling options in the configurator now updates the manifest URL instantly without throwing exceptions.
- **Toggle Switch Redesign**:
  - Replaced native unstyled checkboxes with custom responsive Apple-style Toggle Switch Pills, ensuring identical sizes, smooth transition states, and eliminating browser rendering discrepancies.
- **UI Copy Polish**:
  - Updated secondary copy action button label concisely to "Kopyala".
  - Upgraded Live Preview, Hero, and Guide cards with sleek glassmorphism and subtle lighting.

---

## [1.0.8] - 2026-10-22

### Added & Improved
- **TMDB Precision Search Integration**:
  - Replaced Cinemeta's legacy fuzzy soundex search with TMDB Search API (`/search/tv` and `/search/movie`). Searching for exact titles like "Bojack" now returns strictly relevant titles (*BoJack Horseman*, *Dragon Ball Z: Bojack Unbound*) and eliminates unrelated results (*Black Mirror*, *Black Clover*, *Hijack*).
  - Automatically resolves verified IMDb IDs (`tt...`) via TMDB `external_ids` for 100% streaming provider compatibility.
- **TMDB 4K/HD Catalog Visuals**:
  - Catalog cards now prioritize official TMDB high-resolution backdrops (`/t/p/original`) and posters (`/t/p/w500`), replacing Metahub placeholders with official marketing art and logos.
  - Automatically enriches catalog items with official Turkish titles and synopses from TMDB.

---

## [1.0.7] - 2026-10-22

### Added
- **Intelligent Cache Upgrades & TMDB Synchronization**:
  - Addon now dynamically detects and upgrades legacy Supabase cache entries with official TMDB Turkish overviews, titles, and episode names.
  - Automatic detection and on-the-fly repair for missing (`undefined`) or English episode synopses and titles across all TV seasons.
  - Cast headshot photos (`https://image.tmdb.org/t/p/w276_and_h350_face/...`) embedded into `links` array with `profile` and `thumbnail` properties to enhance actor image presentation in Nuvio and third-party Web clients.
  - Executed database-wide sync (`sync-all-tmdb.mjs`) upgrading all 82 existing catalog entries in Supabase.

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
