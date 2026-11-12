import { NextResponse } from "next/server";
import { getTurkifyStats } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getTurkifyStats(1);
  const totalUsers =
    typeof stats?.total_unique_visitors_all_time === "number"
      ? stats.total_unique_visitors_all_time
      : null;

  return NextResponse.json(
    { totalUsers },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=43200",
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
}
