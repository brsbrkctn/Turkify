import React from "react";
import { HomeClient } from "@/components/HomeClient";
import { getTurkifyStats } from "@/lib/analytics";

export const revalidate = 43200;

export default async function ConfigurePage() {
  let initialTotalUsers: number | null = null;

  try {
    const stats = await getTurkifyStats(1);
    if (
      typeof stats?.total_unique_visitors_all_time === "number" &&
      stats.total_unique_visitors_all_time > 0
    ) {
      initialTotalUsers = stats.total_unique_visitors_all_time;
    }
  } catch {
    initialTotalUsers = null;
  }

  return <HomeClient initialTotalUsers={initialTotalUsers} autoScroll />;
}
