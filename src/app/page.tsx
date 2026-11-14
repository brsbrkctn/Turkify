import React from "react";
import { HomeClient } from "@/components/HomeClient";
import { getTurkifyStats } from "@/lib/analytics";

export const revalidate = 3600;

export default async function Home() {
  let initialTotalUsers: number | null = null;

  try {
    const stats = await getTurkifyStats(1);
    if (typeof stats?.total_unique_visitors_all_time === "number" && stats.total_unique_visitors_all_time > 0) {
      initialTotalUsers = Math.max(stats.total_unique_visitors_all_time, 939);
    } else {
      initialTotalUsers = 939;
    }
  } catch {
    initialTotalUsers = 939;
  }

  return <HomeClient initialTotalUsers={initialTotalUsers} />;
}
