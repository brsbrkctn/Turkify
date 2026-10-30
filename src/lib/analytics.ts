import { NextRequest } from "next/server";
import crypto from "crypto";
import { getSupabase } from "./supabase";

// In-memory cache to debounce rapid successive requests from the same client
const recentVisitorsCache = new Map<string, number>();
const DEBOUNCE_MS = 30 * 1000; // 30 seconds debounce per visitor

/**
 * Checks if a user agent belongs to a known monitoring service, bot, or internal probe.
 */
function isBotOrCron(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return (
    ua.includes("cron-job.org") ||
    ua.includes("uptimerobot") ||
    ua.includes("betteruptime") ||
    ua.includes("healthcheck") ||
    ua.includes("vercel-cron") ||
    ua.includes("headlesschrome") ||
    ua.includes("bot") ||
    ua.includes("crawler") ||
    ua.includes("spider")
  );
}

/**
 * Detects the client platform from the User-Agent header.
 */
function detectClientType(userAgent: string): "Nuvio" | "Stremio" | "Web" | "Other" {
  const ua = userAgent.toLowerCase();
  if (ua.includes("nuvio")) return "Nuvio";
  if (ua.includes("stremio")) return "Stremio";
  if (ua.includes("mozilla") || ua.includes("chrome") || ua.includes("safari")) return "Web";
  if (ua.includes("okhttp")) return "Nuvio"; // Nuvio Android builds frequently identify via OkHttp
  return "Other";
}

/**
 * Generates an irreversible, privacy-preserving cryptographic hash (KVKK / GDPR compliant).
 * Formula: SHA-256(IP + Date + Salt)
 * Real IP is NEVER stored. Hash rotates daily, preventing multi-day tracking.
 */
function generateVisitorHash(ip: string, dateStr: string): string {
  const salt = process.env.ANALYTICS_SALT || "turkify-salt-kvkk-2026";
  return crypto
    .createHash("sha256")
    .update(`${ip}:${dateStr}:${salt}`)
    .digest("hex")
    .slice(0, 32);
}

/**
 * Asynchronously records an anonymous daily visit into Supabase.
 * Guaranteed to be non-blocking with zero impact on addon response times.
 */
export function recordDailyVisit(request: NextRequest): void {
  // Execute completely in the background without awaiting
  (async () => {
    try {
      const userAgent = request.headers.get("user-agent") || "unknown";

      // 1. Ignore bots, monitoring services, and health probes
      if (isBotOrCron(userAgent)) return;

      // 2. Extract client IP and geolocation from Vercel headers
      const forwardedFor = request.headers.get("x-forwarded-for");
      const clientIp = forwardedFor
        ? forwardedFor.split(",")[0].trim()
        : request.headers.get("x-real-ip") || "unknown";

      if (!clientIp || clientIp === "unknown") return;

      const clientType = detectClientType(userAgent);
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const visitorHash = generateVisitorHash(clientIp, today);

      // 3. Debounce rapid sequential requests from same visitor (e.g. browsing 20 episodes)
      const cacheKey = `${visitorHash}:${clientType}`;
      const lastRecorded = recentVisitorsCache.get(cacheKey) || 0;
      const now = Date.now();

      if (now - lastRecorded < DEBOUNCE_MS) {
        return;
      }
      recentVisitorsCache.set(cacheKey, now);

      // Clean up old entries from memory cache periodically (every 1000 items)
      if (recentVisitorsCache.size > 1000) {
        recentVisitorsCache.forEach((time, key) => {
          if (now - time > 10 * 60 * 1000) recentVisitorsCache.delete(key);
        });
      }

      // 4. Extract location headers provided by Vercel Edge
      const country = request.headers.get("x-vercel-ip-country") || "TR";
      const rawCity = request.headers.get("x-vercel-ip-city") || "";
      const city = rawCity ? decodeURIComponent(rawCity) : "";

      // 5. Persist to Supabase via atomic stored procedure
      const client = getSupabase();
      if (!client) return;

      const { error } = await client.rpc("record_daily_visit", {
        p_visitor_hash: visitorHash,
        p_client_type: clientType,
        p_country: country,
        p_city: city,
      });

      if (error) {
        console.warn("[Analytics] record_daily_visit error:", error.message);
      }
    } catch (err: any) {
      // Silently catch all errors to ensure 100% addon uptime
      console.warn("[Analytics] Tracking exception:", err?.message || err);
    }
  })();
}

export interface TurkifyStats {
  total_unique_visitors_today: number;
  total_requests_today: number;
  platforms_today: Record<string, number>;
  countries_today: Record<string, number>;
  recent_days: Array<{
    date: string;
    unique_visitors: number;
    total_requests: number;
  }>;
}

/**
 * Retrieves aggregated Turkify analytics from Supabase.
 */
export async function getTurkifyStats(days: number = 7): Promise<TurkifyStats | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.rpc("get_turkify_stats", { p_days: days });
    if (error) {
      console.warn("[Analytics] get_turkify_stats error:", error.message);
      return null;
    }
    return data as TurkifyStats;
  } catch (err) {
    console.warn("[Analytics] get_turkify_stats exception:", err);
    return null;
  }
}
