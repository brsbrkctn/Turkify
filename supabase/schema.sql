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
    cast JSONB DEFAULT '[]'::jsonb,            -- Oyuncular
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
