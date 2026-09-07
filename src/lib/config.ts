/** Arabic UI chips → real search topics, plus feed configuration. */

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
