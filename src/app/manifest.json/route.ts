import { NextRequest, NextResponse } from "next/server";
import { getManifest } from "@/lib/manifest";
import { recordDailyVisit } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const userAgent = request.headers.get("user-agent") || "unknown";
  console.log(`[Turkify] Manifest requested by User-Agent: ${userAgent}`);

  // Non-blocking KVKK-compliant anonymous daily visitor analytics
  recordDailyVisit(request);

  const manifest = getManifest(origin);

  return NextResponse.json(manifest, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
