/** YouTube UI chips, search topics, and search filter chips. */

export const TRENDING_REGION = "US";

export interface HomeTopic {
  id: string;
  en: string;
  ar: string;
  query: string;
}

export const HOME_TOPICS: HomeTopic[] = [
  { id: "all", en: "All", ar: "الكل", query: "" },
  { id: "trending", en: "Trending", ar: "الرائج", query: "trending" },
  { id: "gaming", en: "Gaming", ar: "ألعاب", query: "gaming" },
  { id: "minecraft", en: "Minecraft", ar: "ماينكرافت", query: "minecraft gameplay" },
  { id: "tech", en: "Technology", ar: "تقنية", query: "technology review" },
  { id: "cooking", en: "Cooking", ar: "طهي", query: "cooking recipe" },
  { id: "travel", en: "Travel", ar: "سفر", query: "travel vlog" },
  { id: "music", en: "Music", ar: "موسيقى", query: "music video" },
  { id: "cars", en: "Cars", ar: "سيارات", query: "cars review" },
];

export const SEARCH_FILTER_CHIPS = [
  { id: "All", en: "All", ar: "All" },
  { id: "Shorts", en: "Shorts", ar: "Shorts" },
  { id: "Unwatched", en: "Unwatched", ar: "Unwatched" },
  { id: "Watched", en: "Watched", ar: "Watched" },
  { id: "Videos", en: "Videos", ar: "Videos" },
  { id: "Recently uploaded", en: "Recently uploaded", ar: "Recently uploaded" },
  { id: "Live", en: "Live", ar: "Live" },
] as const;

export type SearchFilterId = (typeof SEARCH_FILTER_CHIPS)[number]["id"];

/** Arabic & English UI chips → real search topics. */
export const TOPIC_QUERY: Record<string, string> = {
  All: "",
  Trending: "trending",
  Gaming: "gaming",
  Minecraft: "minecraft gameplay",
  Technology: "technology review",
  Cooking: "cooking recipe",
  Travel: "travel vlog",
  Music: "music video",
  Cars: "cars review",
  الكل: "",
  الرائج: "trending",
  ألعاب: "gaming",
  ماينكرافت: "minecraft gameplay",
  تقنية: "technology review",
  طهي: "cooking recipe",
  سفر: "travel vlog",
  موسيقى: "music video",
  سيارات: "cars review",
};

export const CHIPS = HOME_TOPICS.map((t) => t.en);
