import { channelIdFromUrl, videoIdFromUrl } from "./format";
import type { HistoryRow, PipedVideo, Subscription } from "./types";

export const HALF_LIFE_DAYS = 14;

const STOP_WORDS = new Set([
  // عربي
  "في",
  "من",
  "على",
  "الى",
  "إلى",
  "عن",
  "مع",
  "هذا",
  "هذه",
  "ذلك",
  "التي",
  "الذي",
  "كل",
  "بعد",
  "قبل",
  "ما",
  "لا",
  "هل",
  "كيف",
  "ليه",
  "ازاي",
  "إزاي",
  "يا",
  "او",
  "أو",
  "و",
  "ثم",
  "لكن",
  "حتى",
  "انا",
  "أنا",
  "احنا",
  "احلى",
  "اقوى",
  "افضل",
  "أفضل",
  "جديد",
  "حصري",
  "شرح",
  "فيديو",
  "الحلقة",
  "الجزء",
  "كامل",
  // إنجليزي
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "is",
  "are",
  "be",
  "this",
  "that",
  "how",
  "what",
  "why",
  "best",
  "top",
  "new",
  "full",
  "official",
  "video",
  "part",
  "ep",
  "episode",
  "vs",
  "you",
  "your",
  "my",
  "i",
  "it",
  "can",
  "do",
  "does",
  "not",
  "from",
  "by",
  "at",
  "as",
  "we",
]);

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text: string, withBigrams = true): string[] {
  const words = normalizeText(text)
    .split(" ")
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

  if (!withBigrams) return words;

  const out = [...words];
  for (let i = 0; i < words.length - 1; i++) out.push(`${words[i]} ${words[i + 1]}`);
  return out;
}

export function timeDecay(isoDate?: string): number {
  if (!isoDate) return 0.3;
  const ms = Date.now() - new Date(isoDate).getTime();
  if (!Number.isFinite(ms) || ms < 0) return 1;
  const days = ms / 86_400_000;
  return Math.pow(0.5, days / HALF_LIFE_DAYS);
}

export interface TasteProfile {
  channels: Map<string, number>;
  topics: Map<string, number>;
  muted: Set<string>;
  watched: Set<string>;
  resumable: string[];
  avgCompletion: number;
  preferredDuration: number;
  topInterests: string[];
  signalCount: number;
}

export interface BuildProfileInput {
  history: HistoryRow[];
  progress: Record<string, number>;
  likedIds: string[];
  subs: Subscription[];
  searches?: string[];
}

function engagement(row: HistoryRow, watchedSeconds: number): number {
  const dur = row.duration || 0;
  if (dur <= 0) return watchedSeconds > 60 ? 0.5 : 0.15;

  const ratio = Math.min(1, watchedSeconds / dur);
  if (ratio < 0.08) return -1;
  if (ratio < 0.2) return -0.4;
  if (ratio < 0.45) return 0.25;
  if (ratio < 0.75) return 0.7;
  return 1;
}

function bump(map: Map<string, number>, key: string, value: number) {
  map.set(key, (map.get(key) || 0) + value);
}

export function buildTasteProfile(input: BuildProfileInput): TasteProfile {
  const { history, progress, likedIds, subs, searches = [] } = input;

  const channels = new Map<string, number>();
  const rawTopics = new Map<string, number>();
  const channelNegatives = new Map<string, number>();
  const watched = new Set<string>();
  const resumable: string[] = [];

  const liked = new Set(likedIds);
  let completionSum = 0;
  let completionCount = 0;
  let durationSum = 0;
  let durationCount = 0;
  let signalCount = 0;

  for (const row of history) {
    watched.add(row.video_id);

    const seconds = progress[row.video_id] ?? 0;
    const decay = timeDecay(row.watched_at);
    let eng = engagement(row, seconds);
    if (liked.has(row.video_id)) eng = Math.min(1.6, eng + 0.6);

    const weight = eng * decay;
    signalCount++;

    if (row.duration && seconds > 0) {
      const ratio = Math.min(1, seconds / row.duration);
      completionSum += ratio;
      completionCount++;
      if (ratio > 0.1 && ratio < 0.9) resumable.push(row.video_id);
      if (ratio >= 0.6) {
        durationSum += row.duration;
        durationCount++;
      }
    }

    const chId = row.channel_id || "";
    if (chId) {
      bump(channels, chId, weight);
      if (eng < 0) bump(channelNegatives, chId, decay);
    }

    if (row.title) {
      for (const t of tokenize(row.title)) bump(rawTopics, t, weight);
    }
    if (row.category) bump(rawTopics, normalizeText(row.category), weight * 1.5);
  }

  for (const s of subs) bump(channels, s.channel_id, 1.2);

  searches.slice(0, 30).forEach((q, i) => {
    const w = 1.4 * Math.pow(0.93, i);
    for (const t of tokenize(q)) bump(rawTopics, t, w);
    signalCount++;
  });

  const muted = new Set<string>();
  for (const [chId, neg] of channelNegatives) {
    if (neg >= 3 && (channels.get(chId) || 0) <= 0) muted.add(chId);
  }

  const maxTopic = Math.max(...rawTopics.values(), 1);
  const topics = new Map<string, number>();
  for (const [k, v] of rawTopics) {
    if (v <= 0) continue;
    const n = v / maxTopic;
    if (n >= 0.06) topics.set(k, n);
  }

  const maxCh = Math.max(...[...channels.values()].map(Math.abs), 1);
  for (const [k, v] of channels) channels.set(k, v / maxCh);

  const topInterests = [...topics.entries()]
    .filter(([k]) => k.includes(" ") || k.length > 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k]) => k);

  return {
    channels,
    topics,
    muted,
    watched,
    resumable: resumable.slice(0, 10),
    avgCompletion: completionCount ? completionSum / completionCount : 0.5,
    preferredDuration: durationCount ? durationSum / durationCount : 600,
    topInterests,
    signalCount,
  };
}

export function topicMatch(profile: TasteProfile, video: PipedVideo): number {
  if (profile.topics.size === 0) return 0;

  const tokens = tokenize(`${video.title} ${video.uploaderName || ""}`);
  if (tokens.length === 0) return 0;

  let sum = 0;
  let hits = 0;
  const seen = new Set<string>();

  for (const t of tokens) {
    if (seen.has(t)) continue;
    seen.add(t);
    const w = profile.topics.get(t);
    if (w) {
      sum += t.includes(" ") ? w * 2 : w;
      hits++;
    }
  }

  if (hits === 0) return 0;
  return Math.min(1, sum / 3);
}

export function channelAffinity(profile: TasteProfile, video: PipedVideo): number {
  const chId = channelIdFromUrl(video.uploaderUrl || "");
  if (!chId) return 0;
  if (profile.muted.has(chId)) return -1;
  return profile.channels.get(chId) ?? 0;
}

export function profileSummary(profile: TasteProfile): string {
  const topChannels: string[] = [];
  for (const [id, score] of [...profile.channels.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)) {
    if (score > 0.2) topChannels.push(id);
  }

  return [
    `اهتمامات: ${profile.topInterests.join("، ") || "غير محددة"}`,
    `متوسط الإكمال: ${(profile.avgCompletion * 100).toFixed(0)}%`,
    `المدة المفضلة: ${Math.round(profile.preferredDuration / 60)} دقيقة`,
    `عدد الإشارات: ${profile.signalCount}`,
    topChannels.length ? `قنوات مفضلة: ${topChannels.length}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
}

export { videoIdFromUrl };
