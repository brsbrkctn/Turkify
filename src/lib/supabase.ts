import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CachedMetadata } from "./types";

let supabaseClient: SupabaseClient | null = null;
const MAX_METADATA_CACHE_SIZE = 1000;
const memoryCache = new Map<string, { data: CachedMetadata; expiresAt: number }>();

/**
 * Stores metadata in fast memory cache with bounded LRU eviction to prevent memory leaks.
 */
function setMetadataMemoryCache(key: string, data: CachedMetadata, ttlMs: number = 6 * 60 * 60 * 1000): void {
  const now = Date.now();

  // If cache exceeds limit, first sweep expired entries
  if (memoryCache.size >= MAX_METADATA_CACHE_SIZE) {
    memoryCache.forEach((v, k) => {
      if (v.expiresAt <= now) {
        memoryCache.delete(k);
      }
    });

    // If still over limit, evict the oldest 200 entries (FIFO / LRU in JS Map)
    if (memoryCache.size >= MAX_METADATA_CACHE_SIZE) {
      let count = 0;
      for (const k of Array.from(memoryCache.keys())) {
        memoryCache.delete(k);
        count++;
        if (count >= 200) break;
      }
    }
  }

  memoryCache.set(key, { data, expiresAt: now + ttlMs });
}

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      supabaseClient = createClient(url, key, {
        auth: { persistSession: false },
      });
      return supabaseClient;
    } catch (err) {
      console.warn("[Supabase] Failed to initialize client:", err);
    }
  }

  return null;
}

/**
 * Retrieves cached translated metadata by IMDb ID (e.g. tt1375666).
 */
export async function getCachedMeta(id: string): Promise<CachedMetadata | null> {
  const cleanId = id.replace(/\.json$/, "");

  // 1. Check in-memory fast cache first
  const cachedMem = memoryCache.get(cleanId);
  if (cachedMem && cachedMem.expiresAt > Date.now()) {
    return cachedMem.data;
  }

  // 2. Check Supabase
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("translated_meta")
      .select("*")
      .eq("id", cleanId)
      .maybeSingle();

    if (error) {
      console.warn(`[Supabase] Query error for ${cleanId}:`, error.message);
      return null;
    }

    if (data) {
      // Store in memory cache for 6 hours
      setMetadataMemoryCache(cleanId, data as CachedMetadata);
      return data as CachedMetadata;
    }
  } catch (err) {
    console.warn(`[Supabase] Cache lookup exception for ${cleanId}:`, err);
  }

  return null;
}

/**
 * Persists translated metadata into Supabase and in-memory cache.
 */
export async function saveCachedMeta(meta: CachedMetadata): Promise<void> {
  const cleanId = meta.id.replace(/\.json$/, "");
  const payload = { ...meta, id: cleanId };

  // Always store in memory cache
  setMetadataMemoryCache(cleanId, payload);

  const client = getSupabase();
  if (!client) return;

  try {
    const { error } = await client.from("translated_meta").upsert(payload, {
      onConflict: "id",
    });

    if (error) {
      console.warn(`[Supabase] Upsert error for ${cleanId}:`, error.message);
    }
  } catch (err) {
    console.warn(`[Supabase] Cache save exception for ${cleanId}:`, err);
  }
}

/**
 * Executes a lightweight query against Supabase to keep the project active
 * and prevent Supabase's 7-day automatic inactivity pause.
 */
export async function pingSupabase(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { ok: false, latencyMs: 0, error: "Supabase client not configured" };
  }

  const start = Date.now();
  try {
    const { error } = await client
      .from("translated_meta")
      .select("id")
      .limit(1);

    const latencyMs = Date.now() - start;
    if (error) {
      return { ok: false, latencyMs, error: error.message };
    }
    return { ok: true, latencyMs };
  } catch (err: any) {
    return { ok: false, latencyMs: Date.now() - start, error: err?.message || "Connection failed" };
  }
}
