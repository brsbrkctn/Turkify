/**
 * Automated test script for Turkify translation and Stremio Addon Protocol.
 */

import { getManifest } from "../src/lib/manifest.js";
import { translateGenres } from "../src/lib/genres.js";
import { translateText, batchTranslate } from "../src/lib/translator.js";
import { fetchCinemetaMeta } from "../src/lib/cinemeta.js";
import { getTranslatedMetadata } from "../src/lib/meta-processor.js";

async function runTests() {
  console.log("=== TURKIFY TEST SUITE ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // Test 1: Manifest
  try {
    const manifest = getManifest();
    assert(manifest.id === "org.brsbrkctn.turkify", "Manifest ID is org.brsbrkctn.turkify");
    assert(manifest.types.includes("movie") && manifest.types.includes("series"), "Manifest supports movie and series");
    assert(manifest.idPrefixes?.includes("tt"), "Manifest specifies tt idPrefix");
  } catch (err) {
    assert(false, `Manifest test crashed: ${err.message}`);
  }

  // Test 2: Genre Translation
  try {
    const translated = translateGenres(["Action", "Sci-Fi", "Thriller"]);
    assert(
      translated[0] === "Aksiyon" && translated[1] === "Bilim Kurgu" && translated[2] === "Gerilim",
      `Genre translation: ${JSON.stringify(translated)}`
    );
  } catch (err) {
    assert(false, `Genre translation crashed: ${err.message}`);
  }

  // Test 3: Text Translation
  try {
    const enText = "A thief who steals corporate secrets through dream-sharing technology.";
    const trText = await translateText(enText);
    assert(
      trText && trText.length > 5 && trText !== enText,
      `Text translation produced Turkish: "${trText}"`
    );
  } catch (err) {
    assert(false, `Text translation crashed: ${err.message}`);
  }

  // Test 4: Batch Translation
  try {
    const episodes = [
      "Walter White discovers he has lung cancer.",
      "Walt and Jesse try to get rid of a body."
    ];
    const results = await batchTranslate(episodes);
    assert(
      results.length === 2 && results[0] !== episodes[0] && results[1] !== episodes[1],
      `Batch translation completed: ${JSON.stringify(results)}`
    );
  } catch (err) {
    assert(false, `Batch translation crashed: ${err.message}`);
  }

  // Test 5: Full Movie Metadata (Inception - tt1375666)
  try {
    console.log("\nTesting full movie metadata for Inception (tt1375666)...");
    const movieRes = await getTranslatedMetadata("movie", "tt1375666");
    assert(movieRes.meta !== null, "Movie meta returned non-null");
    assert(movieRes.meta.id === "tt1375666", "Movie ID matches tt1375666");
    assert(movieRes.meta.name === "Inception", "Original title preserved");
    assert(movieRes.meta.genres?.includes("Aksiyon") || movieRes.meta.genres?.includes("Macera"), "Movie genres translated");
    assert(typeof movieRes.meta.description === "string" && movieRes.meta.description.length > 20, "Movie description exists in Turkish");
    console.log("Movie Description:", movieRes.meta.description.slice(0, 100) + "...");
  } catch (err) {
    assert(false, `Movie metadata test crashed: ${err.message}`);
  }

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests();
