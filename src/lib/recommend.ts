import { getChannel, getStreams, searchPaged, trendingPaged } from "./api";
import { ageDays, channelIdFromUrl, videoIdFromUrl } from "./format";
import type { HistoryRow, PipedVideo, Subscription } from "./types";

/**
 * Home-feed scoring (our own algorithm):
 *
 * score = (subscribed channel ? 8 : 0)
 *       + (category matches any of last 10 watched ? 2 : 0)
 *       + (appeared in relatedStreams of a recently watched video ? 2 : 0)
 *       + recency_weight(published)   // decays over ~14 days
 */

const recencyWeight = (days: number) => Math.max(0, 1 - days / 14);

export interface FeedResult {
  videos: PipedVideo[];
  coldStart: boolean;
  /** Cursor for loading more (trending pages) when the user scrolls down. */
  next: unknown | null;
}

export async function buildHomeFeed(
  subs: Subscription[],
  history: HistoryRow[],
  likedIds: string[] = [],
): Promise<FeedResult> {
  const page = await trendingPaged(); // filler + cold start source
  const trending = page.items;

  const pool = new Map<string, PipedVideo>();
  trending.forEach((v) => {
    const id = videoIdFromUrl(v.url);
    if (id) pool.set(id, v);
  });

  const subbedIds = new Set(subs.map((s) => s.channel_id));

  // 2) Subscriptions feed: latest uploads of each subscribed channel.
  await Promise.allSettled(
    subs.slice(0, 20).map(async (s) => {
      try {
        const ch = await getChannel(s.channel_id);
        (ch.relatedStreams || []).forEach((v) => {
          const id = videoIdFromUrl(v.url);
          if (id && !pool.has(id)) pool.set(id, v);
        });
      } catch {
        // channel fetch failed, ignore gracefully
      }
    }),
  );

  // 3) Related streams of the last 5 watched videos and last 3 liked videos.
  const relatedIds = new Set<string>();
  
  const sources = [
    ...history.slice(0, 5).map(h => h.video_id),
    ...likedIds.slice(0, 3)
  ];

  await Promise.allSettled(
    sources.map(async (videoId) => {
      try {
        const st = await getStreams(videoId);
        (st.relatedStreams || []).forEach((v) => {
          const id = videoIdFromUrl(v.url);
          if (id) {
            relatedIds.add(id);
            if (!pool.has(id)) pool.set(id, v);
          }
        });
      } catch {
        // stream fetch failed, ignore gracefully
      }
    }),
  );

  // 4) Score every candidate according to base signals.
  const recentCats = new Set(
    history
      .slice(0, 10)
      .map((h) => h.category)
      .filter(Boolean) as string[],
  );

  const scored = [...pool.entries()]
    .map(([id, v]) => {
      const chId = channelIdFromUrl(v.uploaderUrl || "");
      let score = recencyWeight(ageDays(v.uploaded, v.uploadedDate));

      // Boost subscribed channels
      if (chId && subbedIds.has(chId)) {
        score += 6;
      }

      if (v.description && recentCats.has(v.description)) score += 2;
      if (relatedIds.has(id)) score += 2;

      return { id, v, score };
    })
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 36).map((s) => s.v);

  // Pad with trending if scoring yielded too little
  if (top.length < 10) {
    const have = new Set(top.map((t) => videoIdFromUrl(t.url)));
    for (const t of trending) {
      if (top.length >= 36) break;
      const id = videoIdFromUrl(t.url);
      if (id && !have.has(id)) {
        top.push(t);
        have.add(id);
      }
    }
  }

  return { videos: top, coldStart: false, next: page.next };
}

export async function buildSubscriptionsFeed(subs: Subscription[]): Promise<PipedVideo[]> {
  if (subs.length === 0) return [];
  const pool = new Map<string, PipedVideo>();
  await Promise.allSettled(
    subs.slice(0, 25).map(async (s) => {
      try {
        const ch = await getChannel(s.channel_id);
        (ch.relatedStreams || []).forEach((v) => {
          const id = videoIdFromUrl(v.url);
          if (id && !pool.has(id)) pool.set(id, v);
        });
      } catch {
        // ignore
      }
    }),
  );
  return Array.from(pool.values()).sort(
    (a, b) => ageDays(a.uploaded, a.uploadedDate) - ageDays(b.uploaded, b.uploadedDate),
  );
}
