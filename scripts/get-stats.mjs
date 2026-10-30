/**
 * Turkify: KVKK-Compliant Analytics Reporting Script
 * Usage: node scripts/get-stats.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://akfnjozqjewiaxfcvgsf.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrZm5qb3pxamV3aWF4ZmN2Z3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MTg2NDUsImV4cCI6MjEwODE5NDY0NX0.DWUPBanll_IGRvBCfD_DJ_8uJCsFw9MeStK_Z-rYy8A";

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("\n================================================");
  console.log("📊 TURKIFY GÜNLÜK VE HAFTALIK KULLANICI RAPORU");
  console.log("================================================\n");

  const { data: stats, error } = await supabase.rpc("get_turkify_stats", { p_days: 7 });

  if (error) {
    console.error("❌ İstatistikler çekilemedi:", error.message);
    process.exit(1);
  }

  console.log("📅 BUGÜNKÜ DURUM (" + new Date().toISOString().split("T")[0] + "):");
  console.log("------------------------------------------------");
  console.log(`👥 Toplam Tekil Kullanıcı:  ${stats.total_unique_visitors_today} kişi`);
  console.log(`🔄 Toplam Çeviri İsteği:    ${stats.total_requests_today} istek`);

  console.log("\n📱 Platform Dağılımı (Bugün):");
  Object.entries(stats.platforms_today || {}).forEach(([platform, count]) => {
    console.log(`   - ${platform.padEnd(10)}: ${count} kullanıcı`);
  });

  console.log("\n🌍 Ülke Dağılımı (Bugün):");
  Object.entries(stats.countries_today || {}).forEach(([country, count]) => {
    console.log(`   - ${country.padEnd(10)}: ${count} kullanıcı`);
  });

  console.log("\n📈 Son 7 Günün İstatistiği:");
  console.log("------------------------------------------------");
  console.log("Tarih       | Tekil Kullanıcı | Toplam İstek");
  console.log("------------+-----------------+-------------");
  (stats.recent_days || []).forEach((day) => {
    console.log(
      `${day.date}  | ${String(day.unique_visitors).padEnd(15)} | ${day.total_requests}`
    );
  });
  console.log("================================================\n");
}

main();
