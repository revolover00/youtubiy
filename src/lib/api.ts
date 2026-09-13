/**
 * Client-side data API.
 *
 * All requests go through our own server (TanStack server functions), which
 * talks to YouTube directly. No public Piped instances, no CORS proxies — the
 * previous source of "everything failed" errors.
 */

import { pushDebug } from "./debug";
import {
  channelFn,
  searchPageFn,
  playlistFn,
  searchVideosFn,
  suggestionsFn,
  trendingFn,
  trendingPageFn,
  videoDetailsFn,
} from "./youtube.functions";
import type {
  ChannelData,
  PipedVideo,
  PlaylistData,
  SearchChannel,
  SearchPlaylist,
  StreamData,
} from "./types";

/** A page of feed items plus an opaque cursor for the next one. */
export interface FeedPage {
  items: PipedVideo[];
  next: unknown | null;
  /** Channel results (search only, first page). */
  channels?: SearchChannel[];
  /** Playlist results (search only, first page). */
  playlists?: SearchPlaylist[];
}

/** First/next page of search results (pass the previous `next`). */
export async function searchPaged(q: string, next: unknown = null): Promise<FeedPage> {
  const r = await run(`بحث · ${q}${next ? " · المزيد" : ""}`, () =>
    searchPageFn({ data: { q, continuation: (next as string | null) ?? null } }),
  );
  return { items: r.items, next: r.continuation, channels: r.channels, playlists: r.playlists };
}

/** First/next page of the hot feed. */
export async function trendingPaged(next: unknown = null): Promise<FeedPage> {
  const cursors = next as (string | null)[] | null;
  const r = await run(`الرائج${next ? " · المزيد" : ""}`, () =>
    trendingPageFn({ data: cursors ? { cursors } : {} }),
  );
  const exhausted = r.cursors.every((c) => !c);
  return { items: r.items, next: exhausted ? null : r.cursors };
}

const preview = (v: unknown) => {
  const s = JSON.stringify(v, null, 1) ?? "";
  return s.length > 200_000 ? s.slice(0, 200_000) + "\n…" : s;
};

async function run<T>(label: string, fn: () => Promise<T>): Promise<T> {
  try {
    const data = await fn();
    pushDebug(label, "server", preview(data));
    return data;
  } catch (e) {
    pushDebug(
      `${label} — فشل`,
      "server",
      e instanceof Error ? `${e.message}\n\n${e.stack ?? ""}` : String(e),
    );
    throw e;
  }
}

export function searchVideos(q: string): Promise<PipedVideo[]> {
  return run(`بحث · ${q}`, () => searchVideosFn({ data: { q } }));
}

export async function suggestions(q: string): Promise<string[]> {
  try {
    return await suggestionsFn({ data: { q } });
  } catch {
    return [];
  }
}

const streamCache = new Map<string, Promise<StreamData>>();

export function getStreams(videoId: string): Promise<StreamData> {
  let p = streamCache.get(videoId);
  if (!p) {
    p = run(`فيديو · ${videoId}`, () => videoDetailsFn({ data: { id: videoId } }));
    streamCache.set(videoId, p);
    p.catch(() => streamCache.delete(videoId));
  }
  return p;
}

const playlistCache = new Map<string, Promise<PlaylistData>>();

export function getPlaylist(id: string): Promise<PlaylistData> {
  let p = playlistCache.get(id);
  if (!p) {
    p = run(`قائمة تشغيل · ${id}`, () => playlistFn({ data: { id } }));
    playlistCache.set(id, p);
    p.catch(() => playlistCache.delete(id));
  }
  return p;
}

const channelCache = new Map<string, Promise<ChannelData>>();

export function getChannel(channelId: string): Promise<ChannelData> {
  let p = channelCache.get(channelId);
  if (!p) {
    p = run(`قناة · ${channelId}`, () => channelFn({ data: { id: channelId } }));
    channelCache.set(channelId, p);
    p.catch(() => channelCache.delete(channelId));
  }
  return p;
}

const trendingCache = { value: null as Promise<PipedVideo[]> | null };

export function getTrending(): Promise<PipedVideo[]> {
  if (!trendingCache.value) {
    trendingCache.value = run("الرائج", () => trendingFn());
    trendingCache.value.catch(() => (trendingCache.value = null));
  }
  return trendingCache.value;
}
