import type { HistoryRow, Subscription, VideoMeta } from "./types";

/* ------------------------------------------------------------------ */
/* Local persistence (always on-device)                                */
/* ------------------------------------------------------------------ */

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / private mode */
  }
}

export function getUserId(): string {
  let id = read<string>("yt.uid", "");
  if (!id) {
    id = "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    write("yt.uid", id);
  }
  return id;
}

/* Video meta cache — derived data captured from real API responses so
   history / watch-later rows can render without re-fetching. */
export function getMeta(id: string): VideoMeta | undefined {
  return read<Record<string, VideoMeta>>("yt.meta", {})[id];
}
export function setMeta(id: string, meta: VideoMeta) {
  const all = read<Record<string, VideoMeta>>("yt.meta", {});
  all[id] = meta;
  // keep cache bounded
  const keys = Object.keys(all);
  if (keys.length > 400) for (const k of keys.slice(0, keys.length - 400)) delete all[k];
  write("yt.meta", all);
}

/* Watch later + liked: personal UI lists, always local. */
export function getWatchLater(): string[] {
  return read<string[]>("yt.later", []);
}
export function setWatchLater(ids: string[]) {
  write("yt.later", ids);
}
export function getLiked(): string[] {
  return read<string[]>("yt.liked", []);
}
export function setLiked(ids: string[]) {
  write("yt.liked", ids);
}

/* ------------------------------------------------------------------ */
/* Subscriptions + history: stored on-device                          */
/* ------------------------------------------------------------------ */

export const USING_SUPABASE = false;

export async function getSubscriptions(): Promise<Subscription[]> {
  return read<Subscription[]>("yt.subs", []);
}

export async function subscribe(sub: Subscription): Promise<void> {
  const list = read<Subscription[]>("yt.subs", []);
  if (!list.some((s) => s.channel_id === sub.channel_id)) {
    list.unshift({ ...sub, added_at: new Date().toISOString() });
    write("yt.subs", list);
  }
}

export async function unsubscribe(channelId: string): Promise<void> {
  write(
    "yt.subs",
    read<Subscription[]>("yt.subs", []).filter((s) => s.channel_id !== channelId),
  );
}

export async function getHistory(): Promise<HistoryRow[]> {
  return read<HistoryRow[]>("yt.history", []);
}

export async function addHistory(row: HistoryRow): Promise<void> {
  const list = read<HistoryRow[]>("yt.history", []);
  const next = [row, ...list.filter((h) => h.video_id !== row.video_id)].slice(0, 200);
  write("yt.history", next);
}

export async function clearHistory(): Promise<void> {
  write("yt.history", []);
}
