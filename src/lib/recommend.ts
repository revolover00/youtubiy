import {
  channelFeed,
  getChannel,
  getStreams,
  homeCandidates,
  searchPaged,
  trendingPaged,
} from "./api";
import { ageDays, channelIdFromUrl, isShortsVideo, videoIdFromUrl } from "./format";
import {
  buildTasteProfile,
  channelAffinity,
  profileSummary,
  topicMatch,
  type TasteProfile,
} from "./signals";
import { getDismissed, getLocalProgress } from "./store";
import type { HistoryRow, PipedVideo, Subscription } from "./types";

export const WEIGHTS = {
  channel: 0.3,
  topic: 0.28,
  related: 0.14,
  freshness: 0.12,
  quality: 0.1,
  duration: 0.06,
};

const FEED_SIZE = 40;
const CANDIDATE_CAP = 450;
const EXPLORE_RATIO = 0.15;
const MAX_PER_CHANNEL_TOP = 2;
const MAX_PER_CHANNEL_TOTAL = 4;

export interface FeedDiagnostics {
  builtAt: number;
  buildMs: number;
  stats: {
    sub: { ok: number; fail: number };
    related: { ok: number; fail: number };
    interest: { ok: number; fail: number };
    trending: { ok: number; fail: number };
  };
  errors: string[];
  signalCount: number;
  coldStart: boolean;
  mutedCount: number;
  poolSize: number;
  finalCount: number;
  top20: {
    id: string;
    title: string;
    score: number;
    parts: Record<string, number>;
    source: string;
  }[];
}

export let lastFeedDiagnostics: FeedDiagnostics | null = null;
const diagListeners = new Set<(d: FeedDiagnostics) => void>();

export function subscribeFeedDiagnostics(fn: (d: FeedDiagnostics) => void): () => void {
  diagListeners.add(fn);
  return () => {
    diagListeners.delete(fn);
  };
}

function updateFeedDiagnostics(diag: FeedDiagnostics) {
  lastFeedDiagnostics = diag;
  diagListeners.forEach((fn) => {
    try {
      fn(diag);
    } catch {
      /* ignore */
    }
  });
}

export interface FeedResult {
  videos: PipedVideo[];
  reserve: PipedVideo[];
  coldStart: boolean;
  next: unknown | null;
  debug?: ScoredItem[];
}

let lastProfile: TasteProfile | null = null;
let lastWatched = new Set<string>();

export interface ScoredItem {
  id: string;
  title: string;
  score: number;
  parts: Record<string, number>;
  source: string;
}

interface Candidate {
  video: PipedVideo;
  sources: Set<string>;
}

const freshness = (days: number) => (days < 0 ? 0.5 : Math.pow(0.5, days / 10));

function qualityPrior(v: PipedVideo): number {
  const views = v.views || 0;
  if (views <= 0) return 0.2;
  const days = Math.max(1, ageDays(v.uploaded, v.uploadedDate));
  const perDay = views / days;
  return Math.min(1, Math.log10(perDay + 1) / 5);
}

function durationFit(v: PipedVideo, preferred: number): number {
  const d = v.duration || 0;
  if (d <= 0) return 0.5;
  const ratio = d / Math.max(60, preferred);
  if (ratio > 0.5 && ratio < 2) return 1;
  if (ratio > 0.25 && ratio < 4) return 0.6;
  return 0.25;
}

function addCandidate(pool: Map<string, Candidate>, v: PipedVideo, source: string) {
  const id = videoIdFromUrl(v.url);
  if (!id) return;
  const existing = pool.get(id);
  if (existing) {
    existing.sources.add(source);
    return;
  }
  if (pool.size >= CANDIDATE_CAP) return;
  pool.set(id, { video: v, sources: new Set([source]) });
}

async function generateCandidates(
  profile: TasteProfile,
  subs: Subscription[],
  history: HistoryRow[],
  likedIds: string[],
  searches: string[] = [],
): Promise<{
  pool: Map<string, Candidate>;
  relatedIds: Set<string>;
  next: unknown | null;
  stats: {
    sub: { ok: number; fail: number };
    related: { ok: number; fail: number };
    interest: { ok: number; fail: number };
    trending: { ok: number; fail: number };
  };
  errors: string[];
}> {
  const pool = new Map<string, Candidate>();
  const relatedIds = new Set<string>();

  const rankedSubs = [...subs]
    .sort(
      (a, b) =>
        (profile.channels.get(b.channel_id) ?? 0) - (profile.channels.get(a.channel_id) ?? 0),
    )
    .filter((s) => !profile.muted.has(s.channel_id))
    .slice(0, 40);

  const localProgMap = getLocalProgress();
  const sortedHistory = [...history].sort((a, b) => {
    const timeA = a.watched_at ? new Date(a.watched_at).getTime() : 0;
    const timeB = b.watched_at ? new Date(b.watched_at).getTime() : 0;

    const durA = a.duration || 0;
    const progA = localProgMap[a.video_id] ?? (a.progress || 0);
    const ratioA = durA > 0 ? progA / durA : 0;

    const durB = b.duration || 0;
    const progB = localProgMap[b.video_id] ?? (b.progress || 0);
    const ratioB = durB > 0 ? progB / durB : 0;

    const prefA = ratioA >= 0.4 ? 1 : 0;
    const prefB = ratioB >= 0.4 ? 1 : 0;
    if (prefA !== prefB) return prefB - prefA;
    return timeB - timeA;
  });

  const historySeeds: string[] = [];
  const seenSeeds = new Set<string>();
  for (const h of sortedHistory) {
    if (h.video_id && !seenSeeds.has(h.video_id)) {
      seenSeeds.add(h.video_id);
      historySeeds.push(h.video_id);
      if (historySeeds.length >= 10) break;
    }
  }

  const seeds = [...new Set([...historySeeds, ...likedIds.slice(0, 5)])];

  const rawSearches: string[] =
    searches.length > 0
      ? searches
      : JSON.parse(
          (typeof localStorage !== "undefined" && localStorage.getItem("yt.searches")) || "[]",
        );

  const searchQueries: string[] = [];
  const seenQ = new Set<string>();

  for (const s of rawSearches) {
    const q = typeof s === "string" ? s.trim() : "";
    if (q && !seenQ.has(q.toLowerCase())) {
      seenQ.add(q.toLowerCase());
      searchQueries.push(q);
      if (searchQueries.length >= 3) break;
    }
  }

  const bestBigram = profile.topInterests.find((t) => t.includes(" "));
  if (bestBigram && !seenQ.has(bestBigram.toLowerCase())) {
    searchQueries.push(bestBigram);
  }

  const queries = searchQueries;

  const res = await homeCandidates({
    channelIds: rankedSubs.map((s) => s.channel_id),
    seedVideoIds: seeds,
    queries,
  });

  res.subs.forEach((v) => addCandidate(pool, v, "sub"));
  res.related.forEach((v) => addCandidate(pool, v, "related"));
  res.relatedIds.forEach((id) => relatedIds.add(id));
  res.interest.forEach((v) => addCandidate(pool, v, "interest"));

  const trendingCandidates = profile.signalCount >= 15 ? res.trending.slice(0, 20) : res.trending;
  trendingCandidates.forEach((v) => addCandidate(pool, v, "trending"));

  return {
    pool,
    relatedIds,
    next: res.trendingNext,
    stats: res.stats || {
      sub: { ok: 0, fail: 0 },
      related: { ok: 0, fail: 0 },
      interest: { ok: 0, fail: 0 },
      trending: { ok: 0, fail: 0 },
    },
    errors: res.errors || [],
  };
}

function rank(
  pool: Map<string, Candidate>,
  profile: TasteProfile,
  relatedIds: Set<string>,
): ScoredItem[] {
  const out: ScoredItem[] = [];

  for (const [id, { video, sources }] of pool) {
    if (profile.watched.has(id)) continue;

    const chAff = channelAffinity(profile, video);
    if (chAff <= -0.99) continue;

    const parts = {
      channel: Math.max(0, chAff) * WEIGHTS.channel,
      topic: topicMatch(profile, video) * WEIGHTS.topic,
      related: (relatedIds.has(id) ? 1 : 0) * WEIGHTS.related,
      freshness: freshness(ageDays(video.uploaded, video.uploadedDate)) * WEIGHTS.freshness,
      quality: qualityPrior(video) * WEIGHTS.quality,
      duration: durationFit(video, profile.preferredDuration) * WEIGHTS.duration,
    };

    let score = Object.values(parts).reduce((a, b) => a + b, 0);

    if (chAff < 0) score += chAff * 0.25;

    if (isShortsVideo(video)) {
      score *= profile.preferredDuration < 180 ? 1.05 : 0.7;
    }

    if (sources.size > 1) score *= 1 + 0.08 * (sources.size - 1);

    out.push({
      id,
      title: video.title,
      score,
      parts,
      source: [...sources].join("+"),
    });
  }

  return out.sort((a, b) => b.score - a.score);
}

function getSessionSeed(): number {
  try {
    const key = "yt.sessionSeed";
    const seedStr = sessionStorage.getItem(key);
    if (!seedStr) {
      const newSeed = Math.floor(Math.random() * 0x7fffffff) + 1;
      sessionStorage.setItem(key, String(newSeed));
      return newSeed;
    }
    const n = parseInt(seedStr, 10);
    return Number.isFinite(n) && n > 0 ? n : 123456789;
  } catch {
    return 123456789;
  }
}

function createSeededRandom(initialSeed: number) {
  let s = initialSeed;
  return function next(): number {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function diversify(scored: ScoredItem[], pool: Map<string, Candidate>, size: number): ScoredItem[] {
  const picked: ScoredItem[] = [];
  const perChannel = new Map<string, number>();
  const skipped: ScoredItem[] = [];

  const channelOf = (id: string) =>
    channelIdFromUrl(pool.get(id)?.video.uploaderUrl || "") || `unknown:${id}`;

  const exploreSlots = Math.round(size * EXPLORE_RATIO);
  const rankedSlots = size - exploreSlots;

  for (const item of scored) {
    if (picked.length >= rankedSlots) break;
    const ch = channelOf(item.id);
    const used = perChannel.get(ch) || 0;
    const cap = picked.length < 12 ? MAX_PER_CHANNEL_TOP : MAX_PER_CHANNEL_TOTAL;

    if (used >= cap) {
      skipped.push(item);
      continue;
    }
    perChannel.set(ch, used + 1);
    picked.push(item);
  }

  const rng = createSeededRandom(getSessionSeed());
  const tail = scored.slice(rankedSlots, rankedSlots + 120).concat(skipped);
  for (let i = 0; i < exploreSlots && tail.length > 0; i++) {
    const idx = Math.floor(rng() * tail.length);
    const [item] = tail.splice(idx, 1);
    const ch = channelOf(item.id);
    if ((perChannel.get(ch) || 0) >= MAX_PER_CHANNEL_TOTAL) continue;
    perChannel.set(ch, (perChannel.get(ch) || 0) + 1);
    const maxInsert = Math.max(1, picked.length - 5);
    const insertPos = Math.floor(rng() * maxInsert) + 5;
    picked.splice(Math.min(insertPos, picked.length), 0, item);
  }

  return picked.slice(0, size);
}

export interface BuildFeedOptions {
  progress?: Record<string, number>;
  searches?: string[];
  dismissed?: { videoIds: string[]; channelIds: string[] };
  useAI?: boolean;
  aiPrompt?: string;
  size?: number;
}

export async function buildHomeFeed(
  subs: Subscription[],
  history: HistoryRow[],
  likedIds: string[] = [],
  options: BuildFeedOptions = {},
): Promise<FeedResult> {
  const buildStart = Date.now();
  const { progress = {}, searches = [], dismissed = getDismissed(), size = FEED_SIZE } = options;

  const profile = buildTasteProfile({ history, progress, likedIds, subs, searches, dismissed });
  lastProfile = profile;
  lastWatched = new Set(profile.watched);

  const signalCount = profile.signalCount;
  const topChannels = [...profile.channels.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  console.info("[feed] profile", {
    signalCount,
    muted: profile.muted.size,
    topChannels,
    topInterests: profile.topInterests,
  });

  const coldStart = profile.signalCount < 5;

  if (coldStart) {
    const page = await trendingPaged();
    const pool = new Map<string, Candidate>();
    page.items.forEach((v) => addCandidate(pool, v, "trending"));
    await Promise.allSettled(
      subs.slice(0, 10).map(async (s) => {
        const vids = await channelFeed(s.channel_id);
        (vids || []).slice(0, 5).forEach((v) => addCandidate(pool, v, "sub"));
      }),
    );
    const all = [...pool.values()].map((c) => c.video);
    const videos = all.slice(0, size);

    updateFeedDiagnostics({
      builtAt: Date.now(),
      buildMs: Date.now() - buildStart,
      stats: {
        sub: { ok: subs.length ? 1 : 0, fail: 0 },
        related: { ok: 0, fail: 0 },
        interest: { ok: 0, fail: 0 },
        trending: { ok: page.items.length ? 1 : 0, fail: 0 },
      },
      errors: [],
      signalCount: profile.signalCount,
      coldStart: true,
      mutedCount: profile.muted.size,
      poolSize: pool.size,
      finalCount: videos.length,
      top20: [],
    });

    return {
      videos,
      reserve: all.slice(size),
      coldStart: true,
      next: page.next,
    };
  }

  const { pool, relatedIds, next, stats, errors } = await generateCandidates(
    profile,
    subs,
    history,
    likedIds,
    searches,
  );
  const scored = rank(pool, profile, relatedIds);

  const finalItems = diversify(scored, pool, size * 4);
  const allVideos = finalItems
    .map((i) => pool.get(i.id)?.video)
    .filter((v): v is PipedVideo => Boolean(v));

  const videos = allVideos.slice(0, size);
  const reserve = allVideos.slice(size);

  if (videos.length < 10) {
    const have = new Set(videos.map((v) => videoIdFromUrl(v.url)));
    for (const { video } of pool.values()) {
      if (videos.length >= size) break;
      const id = videoIdFromUrl(video.url);
      if (id && !have.has(id) && !profile.watched.has(id)) {
        videos.push(video);
        have.add(id);
      }
    }
  }

  updateFeedDiagnostics({
    builtAt: Date.now(),
    buildMs: Date.now() - buildStart,
    stats,
    errors,
    signalCount: profile.signalCount,
    coldStart: false,
    mutedCount: profile.muted.size,
    poolSize: pool.size,
    finalCount: videos.length,
    top20: (finalItems || []).slice(0, 20).map((item) => ({
      id: item.id,
      title: item.title,
      score: item.score,
      parts: item.parts,
      source: item.source,
    })),
  });

  return { videos, reserve, coldStart: false, next, debug: finalItems };
}

export async function rerankUnseenWithAI(
  feedResult: FeedResult,
  profile: TasteProfile,
  aiPrompt?: string,
): Promise<FeedResult> {
  if (!feedResult.debug || feedResult.debug.length === 0) return feedResult;
  if (feedResult.videos.length <= 8) return feedResult;

  const visibleHead = feedResult.videos.slice(0, 8);
  const headIds = new Set(visibleHead.map((v) => videoIdFromUrl(v.url)).filter(Boolean));

  const unseenScored = feedResult.debug.filter((item) => !headIds.has(item.id));
  if (unseenScored.length <= 4) return feedResult;

  try {
    const { aiRerank } = await import("./aiAlgorithm");
    const pool = new Map<string, Candidate>();
    [...feedResult.videos, ...feedResult.reserve].forEach((v) => {
      const id = videoIdFromUrl(v.url);
      if (id) pool.set(id, { video: v, sources: new Set(["ai"]) });
    });

    const rerankedScored = await aiRerank({
      scored: unseenScored,
      pool,
      summary: profileSummary(profile),
      userPrompt: aiPrompt,
    });

    const rerankedVideos = rerankedScored
      .map((item) => pool.get(item.id)?.video)
      .filter((v): v is PipedVideo => Boolean(v));

    const newVideos = [...visibleHead, ...rerankedVideos.slice(0, feedResult.videos.length - 8)];
    const newReserve = rerankedVideos.slice(feedResult.videos.length - 8);

    return {
      ...feedResult,
      videos: newVideos,
      reserve: newReserve,
      debug: feedResult.debug,
    };
  } catch {
    return feedResult;
  }
}

export { lastProfile };

export function rankIncoming(items: PipedVideo[]): PipedVideo[] {
  if (!lastProfile) return items;
  const profile = lastProfile;
  const scored: { video: PipedVideo; score: number }[] = [];

  for (const video of items) {
    const id = videoIdFromUrl(video.url);
    if (id && (lastWatched.has(id) || profile.watched.has(id))) continue;

    const chId = channelIdFromUrl(video.uploaderUrl || "");
    if (chId && profile.muted.has(chId)) continue;

    const chAff = channelAffinity(profile, video);
    if (chAff <= -0.99) continue;

    const parts = {
      channel: Math.max(0, chAff) * WEIGHTS.channel,
      topic: topicMatch(profile, video) * WEIGHTS.topic,
      related: 0,
      freshness: freshness(ageDays(video.uploaded, video.uploadedDate)) * WEIGHTS.freshness,
      quality: qualityPrior(video) * WEIGHTS.quality,
      duration: durationFit(video, profile.preferredDuration) * WEIGHTS.duration,
    };

    let score = Object.values(parts).reduce((a, b) => a + b, 0);

    if (chAff < 0) score += chAff * 0.25;

    if (isShortsVideo(video)) {
      score *= profile.preferredDuration < 180 ? 1.05 : 0.7;
    }

    scored.push({ video, score });
  }

  return scored.sort((a, b) => b.score - a.score).map((s) => s.video);
}

export async function buildSubscriptionsFeed(subs: Subscription[]): Promise<PipedVideo[]> {
  if (subs.length === 0) return [];
  const pool = new Map<string, PipedVideo>();
  const targetSubs = subs.slice(0, 40);

  const limit = 6;
  let index = 0;
  async function worker() {
    while (index < targetSubs.length) {
      const s = targetSubs[index++];
      try {
        const vids = await channelFeed(s.channel_id);
        (vids || []).forEach((v) => {
          const id = videoIdFromUrl(v.url);
          if (id && !pool.has(id)) pool.set(id, v);
        });
      } catch {
        // ignore errors for single channel feed
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, targetSubs.length) }, () => worker()));

  return [...pool.values()].sort(
    (a, b) => ageDays(a.uploaded, a.uploadedDate) - ageDays(b.uploaded, b.uploadedDate),
  );
}
