const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env ?? {};

const DEFAULT_INSTANCES = [
  // CDN-backed first (most resilient), then community instances.
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.leptons.xyz",
  "https://pipedapi.nosebs.ru",
  "https://pipedapi-libre.kavin.rocks",
  "https://pipedapi.reallyaweso.me",
  "https://api.piped.private.coffee",
  "https://pipedapi.adminforge.de",
  "https://pipedapi.drgns.space",
  "https://api.piped.yt",
  "https://pipedapi.owo.si",
  "https://pipedapi.ducks.party",
  "https://pipedapi.darkness.services",
  "https://piped-api.privacy.com.de",
  "https://pipedapi.orangenet.cc",
];

/** Last-resort CORS proxies, tried only after every direct instance fails. */
export const CORS_PROXIES: { name: string; wrap: (u: string) => string }[] = [
  { name: "allorigins", wrap: (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}` },
  { name: "corsproxy", wrap: (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}` },
];

/** Piped API instance list — overridable via VITE_PIPED_INSTANCES (comma-separated). */
export const PIPED_INSTANCES: string[] = (
  (env.VITE_PIPED_INSTANCES || "").trim()
    ? env.VITE_PIPED_INSTANCES!.split(",").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_INSTANCES
).map((b) => b.replace(/\/$/, ""));

export const SUPABASE_URL = (env.VITE_SUPABASE_URL || "").trim();
export const SUPABASE_ANON_KEY = (env.VITE_SUPABASE_ANON_KEY || "").trim();
export const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const TRENDING_REGION = "EG";

/** Arabic UI chips → real English search topics. */
export const TOPIC_QUERY: Record<string, string> = {
  "ألعاب": "gaming",
  "ماينكرافت": "minecraft gameplay",
  "تقنية": "technology review",
  "طهي": "cooking recipe",
  "سفر": "travel vlog",
  "موسيقى": "music video",
  "سيارات": "cars review",
};

export const CHIPS = ["الكل", "الرائج", ...Object.keys(TOPIC_QUERY)];
