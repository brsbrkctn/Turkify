/**
 * Free translation engine with multi-source fallback.
 * Primary: Google Translate (gtx client)
 * Secondary: MyMemory free translation API
 */

const inMemoryCache = new Map<string, string>();

/**
 * Translates a single string to Turkish.
 */
export async function translateText(
  text: string,
  targetLang: string = "tr",
  sourceLang: string = "auto"
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text || "";

  // Check in-memory session cache first
  const cacheKey = `${sourceLang}:${targetLang}:${trimmed}`;
  if (inMemoryCache.has(cacheKey)) {
    return inMemoryCache.get(cacheKey)!;
  }

  // 1. Primary engine: Google Translate GTX endpoint
  try {
    const translated = await translateWithGoogleGtx(trimmed, targetLang, sourceLang);
    if (translated && translated.trim().length > 0) {
      inMemoryCache.set(cacheKey, translated);
      return translated;
    }
  } catch (err) {
    console.warn("[Translator] Google GTX failed, attempting fallback...", err);
  }

  // 2. Secondary fallback engine: MyMemory API
  try {
    const translated = await translateWithMyMemory(trimmed, targetLang);
    if (translated && translated.trim().length > 0) {
      inMemoryCache.set(cacheKey, translated);
      return translated;
    }
  } catch (err) {
    console.warn("[Translator] MyMemory fallback failed:", err);
  }

  // 3. Last resort: Return original text gracefully
  return trimmed;
}

/**
 * Primary translation implementation using Google's public endpoint.
 */
async function translateWithGoogleGtx(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<string> {
  // If text is very long, chunk it
  if (text.length > 2500) {
    const chunks = splitIntoChunks(text, 2000);
    const translatedChunks = await Promise.all(
      chunks.map((c) => translateWithGoogleGtx(c, targetLang, sourceLang))
    );
    return translatedChunks.join(" ");
  }

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text
  )}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`Google translate returned status ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const result = data[0].map((item: any) => item[0]).join("");
      return result || text;
    }
    throw new Error("Invalid response format from Google");
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Secondary fallback using MyMemory API.
 */
async function translateWithMyMemory(text: string, targetLang: string): Promise<string> {
  const query = text.length > 500 ? text.slice(0, 500) : text;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    query
  )}&langpair=en|${targetLang}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`MyMemory returned ${response.status}`);
    const data = await response.json();
    if (data?.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    throw new Error("No translation returned by MyMemory");
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Batch translates an array of texts with a concurrency limit.
 */
export async function batchTranslate(
  items: string[],
  concurrency = 4
): Promise<string[]> {
  const results: string[] = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      const item = items[idx];
      if (!item || !item.trim()) {
        results[idx] = item;
      } else {
        results[idx] = await translateText(item);
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function splitIntoChunks(text: string, maxLen: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLen) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}
