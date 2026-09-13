import { getChannel, getStreams, trendingPaged } from "./api";
import { ageDays, channelIdFromUrl, videoIdFromUrl } from "./format";
import type { HistoryRow, PipedVideo, Subscription } from "./types";

/**
 * Home-feed scoring (our own algorithm, not YouTube's):
 *
 * score = (subscribed channel ? 3 : 0)
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
): Promise<FeedResult> {
  const page = await trendingPaged(); // filler + cold start source
  const trending = page.items;

  // Cold start: not enough signal yet → trending alone.
  if (history.length < 10) {
    return { videos: trending, coldStart: true, next: page.next };
  }

  const pool = new Map<string, PipedVideo>();
  trending.forEach((v) => {
    const id = videoIdFromUrl(v.url);
    if (id) pool.set(id, v);
  });

  // 1) Subscriptions feed: latest uploads of each subscribed channel.
  const subbedIds = new Set(subs.map((s) => s.channel_id));
  await Promise.allSettled(
    subs.slice(0, 12).map(async (s) => {
      const ch = await getChannel(s.channel_id);
      (ch.relatedStreams || []).forEach((v) => {
        const id = videoIdFromUrl(v.url);
        if (id && !pool.has(id)) pool.set(id, v);
      });
    }),
  );

  // 2) Related streams of the last 5 watched videos.
  const relatedIds = new Set<string>();
  await Promise.allSettled(
    history.slice(0, 5).map(async (h) => {
      const st = await getStreams(h.video_id);
      (st.relatedStreams || []).forEach((v) => {
        const id = videoIdFromUrl(v.url);
        if (id) {
          relatedIds.add(id);
          if (!pool.has(id)) pool.set(id, v);
        }
      });
    }),
  );

  // 3) Score every candidate.
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
      if (chId && subbedIds.has(chId)) score += 3;
      if (v.description && recentCats.has(v.description)) score += 2;
      if (relatedIds.has(id)) score += 2;
      return { id, v, score };
    })
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 28).map((s) => s.v);

  // Pad with trending if scoring yielded too little.
  if (top.length < 10) {
    const have = new Set(top.map((t) => videoIdFromUrl(t.url)));
    for (const t of trending) {
      if (top.length >= 28) break;
      const id = videoIdFromUrl(t.url);
      if (id && !have.has(id)) {
        top.push(t);
        have.add(id);
      }
    }
  }

  return { videos: top, coldStart: false, next: page.next };
}
