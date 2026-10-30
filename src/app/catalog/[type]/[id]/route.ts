import { NextRequest, NextResponse } from "next/server";
import { getTranslatedCatalog } from "@/lib/catalog";
import { recordDailyVisit } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  const { type, id } = params;

  if (type !== "movie" && type !== "series") {
    return NextResponse.json({ metas: [] }, { status: 404 });
  }

  // Non-blocking KVKK-compliant anonymous daily visitor analytics
  recordDailyVisit(request);

  const cleanId = id.replace(/\.json$/, "").trim();
  const searchParams = request.nextUrl.searchParams;
  const skip = parseInt(searchParams.get("skip") || "0", 10);

  try {
    const result = await getTranslatedCatalog(
      type as "movie" | "series",
      cleanId,
      skip
    );

    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error(`[Catalog API] Error fetching ${type}/${cleanId}:`, err);
    return NextResponse.json({ metas: [] }, { status: 500 });
  }
}
