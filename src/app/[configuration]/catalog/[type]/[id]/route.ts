import { NextRequest, NextResponse } from "next/server";
import { getTranslatedCatalog } from "@/lib/catalog";
import { parseConfig } from "@/lib/config-helper";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { configuration: string; type: string; id: string } }
) {
  const { configuration, type, id } = params;

  if (type !== "movie" && type !== "series") {
    return NextResponse.json({ metas: [] }, { status: 404 });
  }

  const cleanId = id.replace(/\.json$/, "").trim();
  const config = parseConfig(configuration);

  try {
    const result = await getTranslatedCatalog(
      type as "movie" | "series",
      cleanId,
      0,
      undefined,
      config
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
    console.error(`[Config Catalog API] Error fetching ${type}/${cleanId}:`, err);
    return NextResponse.json({ metas: [] }, { status: 500 });
  }
}
