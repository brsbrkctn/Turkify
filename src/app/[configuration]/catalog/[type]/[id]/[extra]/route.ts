import { NextRequest, NextResponse } from "next/server";
import { getTranslatedCatalog } from "@/lib/catalog";
import { parseConfig } from "@/lib/config-helper";
import { recordDailyVisit } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { configuration: string; type: string; id: string; extra: string };
  }
) {
  const { configuration, type, id, extra } = params;

  if (type !== "movie" && type !== "series") {
    return NextResponse.json({ metas: [] }, { status: 404 });
  }

  // Non-blocking KVKK-compliant anonymous daily visitor analytics
  recordDailyVisit(request);

  const cleanId = id.replace(/\.json$/, "").trim();
  const cleanExtra = extra.replace(/\.json$/, "").trim();
  const config = parseConfig(configuration);

  // Parse extra arguments (e.g. search=silo, skip=20, search=silo&skip=0)
  const searchParams = new URLSearchParams(cleanExtra);
  const search = searchParams.get("search") || undefined;
  const skip = parseInt(searchParams.get("skip") || "0", 10) || 0;

  try {
    const result = await getTranslatedCatalog(
      type as "movie" | "series",
      cleanId,
      skip,
      search,
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
    console.error(
      `[Config Catalog API Extra] Error fetching ${type}/${cleanId}:`,
      err
    );
    return NextResponse.json({ metas: [] }, { status: 500 });
  }
}
