import { NextRequest, NextResponse } from "next/server";
import { getTranslatedCatalog } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string; extra: string } }
) {
  const { type, id, extra } = params;

  if (type !== "movie" && type !== "series") {
    return NextResponse.json({ metas: [] }, { status: 404 });
  }

  const cleanId = id.replace(/\.json$/, "").trim();
  const cleanExtra = extra.replace(/\.json$/, "");
  
  let skip = 0;
  if (cleanExtra.startsWith("skip=")) {
    skip = parseInt(cleanExtra.replace("skip=", ""), 10) || 0;
  }

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
    console.error(`[Catalog API Extra] Error fetching ${type}/${cleanId}:`, err);
    return NextResponse.json({ metas: [] }, { status: 500 });
  }
}
