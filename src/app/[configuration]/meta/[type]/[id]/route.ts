import { NextRequest, NextResponse } from "next/server";
import { getTranslatedMetadata } from "@/lib/meta-processor";
import { parseConfig } from "@/lib/config-helper";
import { recordDailyVisit } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { configuration: string; type: string; id: string } }
) {
  const { configuration, type, id } = params;

  if (type !== "movie" && type !== "series") {
    return NextResponse.json(
      { meta: null },
      {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  const cleanId = id.replace(/\.json$/, "").trim();
  const config = parseConfig(configuration);

  // Non-blocking KVKK-compliant anonymous daily visitor analytics
  recordDailyVisit(request);

  try {
    const result = await getTranslatedMetadata(
      type as "movie" | "series",
      cleanId,
      config
    );

    // Prevent CDN cache poisoning on empty/failed metadata (e.g. temporary Cinemeta failure)
    if (!result || !result.meta) {
      return NextResponse.json(
        { meta: null },
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    // Differentiated edge CDN caching:
    // Movies (static): 24h client, 3 days CDN edge (259200s), 24h stale-while-revalidate
    // Series (ongoing weekly episodes): 1h client, 4 hours CDN edge (14400s), 1h stale-while-revalidate
    const cacheControlHeader =
      type === "series"
        ? "public, max-age=3600, s-maxage=14400, stale-while-revalidate=3600"
        : "public, max-age=86400, s-maxage=259200, stale-while-revalidate=86400";

    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": cacheControlHeader,
      },
    });
  } catch (err) {
    console.error(`[API /[configuration]/meta] Error processing ${type}/${cleanId}:`, err);
    return NextResponse.json(
      { meta: null },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
