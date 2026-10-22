import { NextRequest, NextResponse } from "next/server";
import { getTranslatedMetadata } from "@/lib/meta-processor";
import { parseConfig } from "@/lib/config-helper";

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
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }

  const cleanId = id.replace(/\.json$/, "").trim();
  const config = parseConfig(configuration);

  try {
    const result = await getTranslatedMetadata(
      type as "movie" | "series",
      cleanId,
      config
    );

    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error(`[API /[configuration]/meta] Error processing ${type}/${cleanId}:`, err);
    return NextResponse.json(
      { meta: null },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
