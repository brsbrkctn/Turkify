-- =========================================================
-- Turkify: Stremio & Nuvio Türkçe Meta Veritabanı Şeması
-- =========================================================

CREATE TABLE IF NOT EXISTS public.translated_meta (
    id TEXT PRIMARY KEY,                       -- IMDb ID (örn: tt1375666, tt0903747)
    type TEXT NOT NULL,                        -- 'movie' veya 'series'
    title TEXT NOT NULL,                       -- Başlık (veya Türkçe başlık)
    original_title TEXT,                       -- Orijinal başlık
    overview TEXT,                             -- Türkçe film/dizi konusu
    genres JSONB DEFAULT '[]'::jsonb,          -- Türkçe türler listesi (Aksiyon, vb.)
    videos JSONB DEFAULT '[]'::jsonb,          -- Dizi bölümleri ve Türkçe özetleri
    poster TEXT,                               -- Afiş görseli
    background TEXT,                           -- Arka plan görseli
    logo TEXT,                                 -- Şeffaf logo görseli
    imdb_rating TEXT,                          -- IMDb puanı
    release_info TEXT,                         -- Yayın yılı (örn: 2024)
    runtime TEXT,                              -- Süre (örn: 148 min)
    director JSONB DEFAULT '[]'::jsonb,        -- Yönetmenler
    "cast" JSONB DEFAULT '[]'::jsonb,            -- Oyuncular
    source TEXT DEFAULT 'auto',                -- 'tmdb', 'google', 'mymemory'
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hızlı sorgulama indeksleri
CREATE INDEX IF NOT EXISTS idx_translated_meta_type ON public.translated_meta(type);
CREATE INDEX IF NOT EXISTS idx_translated_meta_updated ON public.translated_meta(updated_at DESC);

-- Row Level Security (RLS)
ALTER TABLE public.translated_meta ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (Stremio ve Nuvio istemcileri için açık okuma)
CREATE POLICY "Allow public read access"
ON public.translated_meta FOR SELECT
USING (true);

-- Eklenti sunucusu anon anahtarla yeni çevirileri ekleyebilir
CREATE POLICY "Allow public insert"
ON public.translated_meta FOR INSERT
WITH CHECK (true);

-- Eklenti sunucusu anon anahtarla güncelleyebilir
CREATE POLICY "Allow public update"
ON public.translated_meta FOR UPDATE
USING (true)
WITH CHECK (true);

-- =========================================================
-- Turkify: KVKK Uyumlu Anonim Günlük İstatistik Şeması
-- =========================================================

CREATE TABLE IF NOT EXISTS public.daily_analytics (
    id TEXT PRIMARY KEY,                       -- 'YYYY-MM-DD:hash:Client'
    date DATE NOT NULL DEFAULT CURRENT_DATE,    -- '2026-10-30'
    visitor_hash TEXT NOT NULL,                 -- SHA-256 (32 karakter) anonimleştirilmiş özet
    client_type TEXT NOT NULL DEFAULT 'Other',  -- 'Nuvio', 'Stremio', 'Web', 'Other'
    country TEXT DEFAULT 'TR',                  -- 'TR', 'DE', vb.
    city TEXT DEFAULT '',                       -- 'Istanbul', 'Ankara', vb.
    request_count INT NOT NULL DEFAULT 1,       -- O günkü toplam istek sayısı
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_daily_visitor UNIQUE (date, visitor_hash, client_type)
);

CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON public.daily_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_client ON public.daily_analytics(client_type);

ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_analytics' AND policyname = 'Allow public insert to daily_analytics') THEN
        CREATE POLICY "Allow public insert to daily_analytics" ON public.daily_analytics FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_analytics' AND policyname = 'Allow public update to daily_analytics') THEN
        CREATE POLICY "Allow public update to daily_analytics" ON public.daily_analytics FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_analytics' AND policyname = 'Allow public select on daily_analytics') THEN
        CREATE POLICY "Allow public select on daily_analytics" ON public.daily_analytics FOR SELECT USING (true);
    END IF;
END
$$;

-- Atomik Ziyaretçi Kayıt Fonksiyonu (Eşzamanlı ve Hızlı)
CREATE OR REPLACE FUNCTION public.record_daily_visit(
    p_visitor_hash TEXT,
    p_client_type TEXT DEFAULT 'Other',
    p_country TEXT DEFAULT 'TR',
    p_city TEXT DEFAULT ''
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_today DATE := CURRENT_DATE;
    v_id TEXT := v_today || ':' || p_visitor_hash || ':' || p_client_type;
BEGIN
    INSERT INTO public.daily_analytics (id, date, visitor_hash, client_type, country, city, request_count, first_seen_at, last_seen_at)
    VALUES (v_id, v_today, p_visitor_hash, p_client_type, p_country, p_city, 1, NOW(), NOW())
    ON CONFLICT (date, visitor_hash, client_type)
    DO UPDATE SET
        request_count = public.daily_analytics.request_count + 1,
        last_seen_at = NOW(),
        city = CASE WHEN public.daily_analytics.city = '' AND p_city <> '' THEN p_city ELSE public.daily_analytics.city END;
END;
$$;

-- İstatistik Çekme Fonksiyonu
CREATE OR REPLACE FUNCTION public.get_turkify_stats(p_days INT DEFAULT 7)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_unique_visitors_today', (
            SELECT COUNT(DISTINCT visitor_hash) FROM public.daily_analytics WHERE date = CURRENT_DATE
        ),
        'total_requests_today', (
            SELECT COALESCE(SUM(request_count), 0) FROM public.daily_analytics WHERE date = CURRENT_DATE
        ),
        'platforms_today', (
            SELECT COALESCE(json_object_agg(client_type, count), '{}'::json) FROM (
                SELECT client_type, COUNT(DISTINCT visitor_hash) as count
                FROM public.daily_analytics
                WHERE date = CURRENT_DATE
                GROUP BY client_type
            ) s
        ),
        'countries_today', (
            SELECT COALESCE(json_object_agg(country, count), '{}'::json) FROM (
                SELECT COALESCE(country, 'Unknown') as country, COUNT(DISTINCT visitor_hash) as count
                FROM public.daily_analytics
                WHERE date = CURRENT_DATE
                GROUP BY country
                ORDER BY count DESC
                LIMIT 5
            ) c
        ),
        'recent_days', (
            SELECT COALESCE(json_agg(day_stat), '[]'::json) FROM (
                SELECT
                    date,
                    COUNT(DISTINCT visitor_hash) as unique_visitors,
                    SUM(request_count) as total_requests
                FROM public.daily_analytics
                WHERE date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
                GROUP BY date
                ORDER BY date DESC
            ) day_stat
        )
    ) INTO result;
    RETURN result;
END;
$$;
