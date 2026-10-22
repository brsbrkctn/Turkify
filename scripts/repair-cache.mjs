import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://akfnjozqjewiaxfcvgsf.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrZm5qb3pxamV3aWF4ZmN2Z3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MTg2NDUsImV4cCI6MjEwODE5NDY0NX0.DWUPBanll_IGRvBCfD_DJ_8uJCsFw9MeStK_Z-rYy8A";

const DELIMITER = "\n[[[TR_SEP]]]\n";

function isLikelyEnglish(text) {
  if (!text || text.trim().length < 8) return false;
  if (/[çğıöşüÇĞİÖŞÜ]/.test(text)) return false;
  return /\b(the|and|with|from|after|before|when|into|their|about|while|which|where|this|that|they|have|been|during|discovers)\b/i.test(
    text
  );
}

async function batchTranslateChunk(texts) {
  if (texts.length === 0) return [];
  const combined = texts.join(DELIMITER);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(
    combined
  )}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const full = data[0].map((item) => item[0]).join("");
  const parts = full.split(/\[\[\[TR_SEP\]\]\]/).map((s) => s.trim());
  if (parts.length === texts.length) return parts;
  throw new Error("Split length mismatch");
}

async function batchTranslateAll(items) {
  const CHUNK_SIZE = 12;
  const results = new Array(items.length);
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE);
    try {
      const translated = await batchTranslateChunk(chunk);
      for (let j = 0; j < chunk.length; j++) {
        results[i + j] = translated[j];
      }
    } catch (err) {
      console.warn("Chunk batch fallback to individual:", err.message);
      for (let j = 0; j < chunk.length; j++) {
        const singleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(
          chunk[j]
        )}`;
        const sRes = await fetch(singleUrl);
        const sData = await sRes.json();
        results[i + j] = sData[0].map((item) => item[0]).join("");
      }
    }
  }
  return results;
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("Fetching series from Supabase...");
  const { data: series, error } = await supabase
    .from("translated_meta")
    .select("id, title, videos, type")
    .eq("type", "series");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  console.log(`Found ${series.length} series.`);

  for (const item of series) {
    if (!item.videos || item.videos.length === 0) continue;

    const englishIndices = [];
    const textsToTranslate = [];

    item.videos.forEach((v, idx) => {
      const desc = v.overview || v.description;
      if (isLikelyEnglish(desc)) {
        englishIndices.push(idx);
        textsToTranslate.push(desc);
      }
    });

    if (englishIndices.length === 0) {
      continue;
    }

    console.log(
      `Fixing ${item.title} (${item.id}): Translating ${englishIndices.length} English episodes...`
    );

    try {
      const translated = await batchTranslateAll(textsToTranslate);
      const updatedVideos = [...item.videos];

      englishIndices.forEach((idx, i) => {
        const tr = translated[i];
        if (tr) {
          updatedVideos[idx] = {
            ...updatedVideos[idx],
            overview: tr,
            description: tr,
          };
        }
      });

      const { error: updateErr } = await supabase
        .from("translated_meta")
        .update({
          videos: updatedVideos,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      if (updateErr) {
        console.error(`Failed to update ${item.id}:`, updateErr.message);
      } else {
        console.log(`Successfully updated ${item.title} (${item.id})!`);
      }
    } catch (err) {
      console.error(`Error processing ${item.id}:`, err);
    }
  }

  console.log("Database repair complete!");
}

main().catch(console.error);
