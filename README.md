# Turkify 🇹🇷

A high-performance, open-source metadata provider addon for **Stremio** and **Nuvio** that automatically delivers Turkish titles, overviews, genres, and episodic summaries for movies and TV series.

---

## 🌟 Features

- **Automatic Turkish Translations**: Automatically translates movie and series plot overviews, genres, and season/episode descriptions into natural Turkish.
- **Smart Hybrid Architecture**:
  1. **Supabase PostgreSQL Cache**: Fetches previously translated metadata in under 50ms.
  2. **TMDB Native Turkish Database**: Integrates directly with TMDB for human-verified Turkish synopsis and artwork when available.
  3. **Zero-Cost Free Translation Engine**: Automatically translates missing or English descriptions with multi-source fallback.
  4. **Cinemeta Reliability**: Gracefully falls back to original Cinemeta metadata to ensure 100% uptime.
- **Full Torrent & Stream Addon Compatibility**: Preserves original IMDb IDs (`tt...`) and original English title matching, ensuring torrent scrapers (Torrentio, Comet, KnightCrawler, etc.) find streams without missing links.
- **Nuvio & Stremio Protocol Compliant**: Standard Stremio Addon Protocol v3 endpoint structure (`/manifest.json`, `/meta/:type/:id.json`).
- **Interactive Web Configurator**: Clean web interface at `/` and `/configure` with one-click install for Stremio and quick-copy setup for Nuvio.
- **Zero Configuration Required**: Works out of the box with zero required API keys using the built-in free translation engine and in-memory cache.

---

## 🚀 Quick Start & Installation

### Stremio
1. Visit the web configurator at `https://turkify-addon.vercel.app`.
2. Click **"Stremio'ya Otomatik Ekle"** (or open `stremio://turkify-addon.vercel.app/manifest.json`).
3. Click **Install** in Stremio.

### Nuvio
1. Copy the addon manifest URL: `https://turkify-addon.vercel.app/manifest.json`.
2. Open Nuvio and navigate to **Settings > Content & Discovery > Addons**.
3. Paste the URL into the **Addon URL** field and save.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Cache**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Deployment**: [Vercel](https://vercel.com/) Serverless
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Environment Variables (Optional)

Create a `.env.local` file in the project root:

```env
# Supabase Cache (Optional - falls back to fast in-memory cache if omitted)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_or_anon_key

# TMDB API (Optional - enhances Turkish metadata matching)
TMDB_API_KEY=your_tmdb_v3_api_key
```

---

## 📦 Database Setup (Supabase)

If using Supabase for persistent multi-user caching, run the following SQL script located in `supabase/schema.sql` in the Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.translated_meta (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    original_title TEXT,
    overview TEXT,
    genres JSONB DEFAULT '[]'::jsonb,
    videos JSONB DEFAULT '[]'::jsonb,
    poster TEXT,
    background TEXT,
    logo TEXT,
    imdb_rating TEXT,
    release_info TEXT,
    runtime TEXT,
    director JSONB DEFAULT '[]'::jsonb,
    cast JSONB DEFAULT '[]'::jsonb,
    source TEXT DEFAULT 'auto',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_translated_meta_type ON public.translated_meta(type);
CREATE INDEX IF NOT EXISTS idx_translated_meta_updated ON public.translated_meta(updated_at DESC);

ALTER TABLE public.translated_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.translated_meta FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.translated_meta FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.translated_meta FOR UPDATE USING (true) WITH CHECK (true);
```

---

## 🧪 Testing

Run the automated test suite:

```bash
npm test
```

Build for production:

```bash
npm run build
```

---

## 📄 License

MIT License.
