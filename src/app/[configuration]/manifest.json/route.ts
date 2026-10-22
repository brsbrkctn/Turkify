import { NextRequest, NextResponse } from "next/server";
import { getManifest } from "@/lib/manifest";
import { parseConfig } from "@/lib/config-helper";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { configuration: string } }
) {
  const origin = request.nextUrl.origin;
  const config = parseConfig(params.configuration);
  const manifest = getManifest(origin, config);

  return NextResponse.json(manifest, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
