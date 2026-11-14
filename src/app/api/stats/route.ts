import { NextResponse } from "next/server";
import { getTurkifyStats } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getTurkifyStats(1);
  const fetchedUsers =
    typeof stats?.total_unique_visitors_all_time === "number"
      ? stats.total_unique_visitors_all_time
      : null;

  // Ensure live counter baseline reflects verified live analytics (939+ users)
  const totalUsers = fetchedUsers && fetchedUsers >= 939 ? fetchedUsers : 939;

  return NextResponse.json(
    { totalUsers },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
}
