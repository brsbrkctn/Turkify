import { NextResponse } from "next/server";
import { pingSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const dbResult = await pingSupabase();

  return NextResponse.json(
    {
      status: "ok",
      service: "turkify",
      version: "1.1.7",
      timestamp: new Date().toISOString(),
      database: {
        active: dbResult.ok,
        latencyMs: dbResult.latencyMs,
        ...(dbResult.error ? { error: dbResult.error } : {}),
      },
      durationMs: Date.now() - startTime,
    },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
}
