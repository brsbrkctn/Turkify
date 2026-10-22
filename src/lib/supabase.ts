import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CachedMetadata } from "./types";

let supabaseClient: SupabaseClient | null = null;
const memoryCache = new Map<string, { data: CachedMetadata; expiresAt: number }>();

function getSupabase(): SupabaseClient | null {
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
      memoryCache.set(cleanId, {
        data: data as CachedMetadata,
        expiresAt: Date.now() + 6 * 60 * 60 * 1000,
      });
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
  memoryCache.set(cleanId, {
    data: payload,
    expiresAt: Date.now() + 6 * 60 * 60 * 1000,
  });

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
