import { NextRequest, NextResponse } from "next/server";
import { getTranslatedMetadata } from "@/lib/meta-processor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  const { type, id } = params;

  if (type !== "movie" && type !== "series") {
    return NextResponse.json(
      { meta: null },
      {
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }

  const cleanId = id.replace(/\.json$/, "").trim();
  const userAgent = request.headers.get("user-agent") || "unknown";
  console.log(`[Turkify] Meta requested: ${type}/${cleanId} by User-Agent: ${userAgent}`);

  try {
    const result = await getTranslatedMetadata(type as "movie" | "series", cleanId);

    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error(`[API /meta] Error processing ${type}/${cleanId}:`, err);
    return NextResponse.json(
      { meta: null },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
