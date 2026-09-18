import { getChannel, getStreams, searchPaged, trendingPaged } from "./api";
import { ageDays, channelIdFromUrl, isShortsVideo, videoIdFromUrl } from "./format";
import {
  buildTasteProfile,
  channelAffinity,
  profileSummary,
  topicMatch,
  type TasteProfile,
} from "./signals";
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

export interface FeedResult {
  videos: PipedVideo[];
  coldStart: boolean;
  next: unknown | null;
  debug?: ScoredItem[];
}

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
): Promise<{ pool: Map<string, Candidate>; relatedIds: Set<string>; next: unknown | null }> {
  const pool = new Map<string, Candidate>();
  const relatedIds = new Set<string>();

  const rankedSubs = [...subs]
    .sort(
      (a, b) =>
        (profile.channels.get(b.channel_id) ?? 0) - (profile.channels.get(a.channel_id) ?? 0),
    )
    .filter((s) => !profile.muted.has(s.channel_id))
    .slice(0, 25);

  const seeds = [
    ...history
      .filter((h) => (h.progress || 0) > 0 && (h.duration || 0) > 0)
      .filter((h) => (h.progress as number) / (h.duration as number) > 0.45)
      .slice(0, 6)
      .map((h) => h.video_id),
    ...likedIds.slice(0, 4),
  ];

  const queries = profile.topInterests.slice(0, 4);

  const [trendingPage] = await Promise.all([
    trendingPaged().catch(() => ({ items: [] as PipedVideo[], next: null })),
    Promise.allSettled(
      rankedSubs.map(async (s) => {
        const ch = await getChannel(s.channel_id);
        (ch.relatedStreams || []).slice(0, 8).forEach((v) => addCandidate(pool, v, "sub"));
      }),
    ),
    Promise.allSettled(
      [...new Set(seeds)].map(async (videoId) => {
        const st = await getStreams(videoId);
        (st.relatedStreams || []).slice(0, 15).forEach((v) => {
          const id = videoIdFromUrl(v.url);
          if (id) relatedIds.add(id);
          addCandidate(pool, v, "related");
        });
      }),
    ),
    Promise.allSettled(
      queries.map(async (q) => {
        const r = await searchPaged(q);
        r.items.slice(0, 12).forEach((v) => addCandidate(pool, v, "interest"));
      }),
    ),
  ]);

  trendingPage.items.forEach((v) => addCandidate(pool, v, "trending"));

  return { pool, relatedIds, next: trendingPage.next };
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

  const tail = scored.slice(rankedSlots, rankedSlots + 120).concat(skipped);
  for (let i = 0; i < exploreSlots && tail.length > 0; i++) {
    const idx = Math.floor(Math.random() * tail.length);
    const [item] = tail.splice(idx, 1);
    const ch = channelOf(item.id);
    if ((perChannel.get(ch) || 0) >= MAX_PER_CHANNEL_TOTAL) continue;
    perChannel.set(ch, (perChannel.get(ch) || 0) + 1);
    picked.splice(Math.floor(Math.random() * (picked.length - 5)) + 5, 0, item);
  }

  return picked.slice(0, size);
}

export interface BuildFeedOptions {
  progress?: Record<string, number>;
  searches?: string[];
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
  const { progress = {}, searches = [], size = FEED_SIZE, useAI = false, aiPrompt } = options;

  const profile = buildTasteProfile({ history, progress, likedIds, subs, searches });
  const coldStart = profile.signalCount < 5;

  if (coldStart) {
    const page = await trendingPaged();
    const pool = new Map<string, Candidate>();
    page.items.forEach((v) => addCandidate(pool, v, "trending"));
    await Promise.allSettled(
      subs.slice(0, 10).map(async (s) => {
        const ch = await getChannel(s.channel_id);
        (ch.relatedStreams || []).slice(0, 5).forEach((v) => addCandidate(pool, v, "sub"));
      }),
    );
    return {
      videos: [...pool.values()].map((c) => c.video).slice(0, size),
      coldStart: true,
      next: page.next,
    };
  }

  const { pool, relatedIds, next } = await generateCandidates(profile, subs, history, likedIds);
  let scored = rank(pool, profile, relatedIds);

  if (useAI && scored.length > 12) {
    try {
      const { aiRerank } = await import("./aiAlgorithm");
      scored = await aiRerank({
        scored,
        pool,
        summary: profileSummary(profile),
        userPrompt: aiPrompt,
      });
    } catch {
      // ignore
    }
  }

  const finalItems = diversify(scored, pool, size);
  const videos = finalItems
    .map((i) => pool.get(i.id)?.video)
    .filter((v): v is PipedVideo => Boolean(v));

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

  return { videos, coldStart: false, next, debug: finalItems };
}

export async function buildSubscriptionsFeed(subs: Subscription[]): Promise<PipedVideo[]> {
  if (subs.length === 0) return [];
  const pool = new Map<string, PipedVideo>();

  await Promise.allSettled(
    subs.slice(0, 30).map(async (s) => {
      const ch = await getChannel(s.channel_id);
      (ch.relatedStreams || []).forEach((v) => {
        const id = videoIdFromUrl(v.url);
        if (id && !pool.has(id)) pool.set(id, v);
      });
    }),
  );

  return [...pool.values()].sort(
    (a, b) => ageDays(a.uploaded, a.uploadedDate) - ageDays(b.uploaded, b.uploadedDate),
  );
}
