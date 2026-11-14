import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

export function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(root, file);
    if (fs.existsSync(p)) {
      try {
        if (typeof process.loadEnvFile === "function") {
          process.loadEnvFile(p);
        } else {
          const content = fs.readFileSync(p, "utf-8");
          for (const line of content.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx !== -1) {
              const k = trimmed.slice(0, eqIdx).trim();
              const v = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
              if (!process.env[k]) process.env[k] = v;
            }
          }
        }
      } catch {
        // Fall back gracefully
      }
    }
  }
}

loadEnv();
