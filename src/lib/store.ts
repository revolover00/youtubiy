import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { HAS_SUPABASE, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
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
/* Subscriptions + history: Supabase when configured, else local       */
/* ------------------------------------------------------------------ */

const sb: SupabaseClient | null = HAS_SUPABASE
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const USING_SUPABASE = HAS_SUPABASE;
const uid = getUserId();

export async function getSubscriptions(): Promise<Subscription[]> {
  if (sb) {
    const { data, error } = await sb
      .from("subscriptions")
      .select("channel_id, channel_name, channel_avatar_url, added_at")
      .eq("user_id", uid)
      .order("added_at", { ascending: false });
    if (!error && data) return data as Subscription[];
  }
  return read<Subscription[]>("yt.subs", []);
}

export async function subscribe(sub: Subscription): Promise<void> {
  if (sb) {
    await sb.from("subscriptions").insert({
      user_id: uid,
      channel_id: sub.channel_id,
      channel_name: sub.channel_name,
      channel_avatar_url: sub.channel_avatar_url ?? null,
      added_at: new Date().toISOString(),
    });
  }
  const list = read<Subscription[]>("yt.subs", []);
  if (!list.some((s) => s.channel_id === sub.channel_id)) {
    list.unshift({ ...sub, added_at: new Date().toISOString() });
    write("yt.subs", list);
  }
}

export async function unsubscribe(channelId: string): Promise<void> {
  if (sb) {
    await sb.from("subscriptions").delete().eq("user_id", uid).eq("channel_id", channelId);
  }
  write(
    "yt.subs",
    read<Subscription[]>("yt.subs", []).filter((s) => s.channel_id !== channelId)
  );
}

export async function getHistory(): Promise<HistoryRow[]> {
  if (sb) {
    const { data, error } = await sb
      .from("watch_history")
      .select("video_id, channel_id, category, watched_at")
      .eq("user_id", uid)
      .order("watched_at", { ascending: false })
      .limit(200);
    if (!error && data) return data as HistoryRow[];
  }
  return read<HistoryRow[]>("yt.history", []);
}

export async function addHistory(row: HistoryRow): Promise<void> {
  if (sb) {
    await sb.from("watch_history").insert({
      user_id: uid,
      video_id: row.video_id,
      channel_id: row.channel_id ?? null,
      category: row.category ?? null,
      watched_at: row.watched_at,
    });
  }
  const list = read<HistoryRow[]>("yt.history", []);
  const next = [row, ...list.filter((h) => h.video_id !== row.video_id)].slice(0, 200);
  write("yt.history", next);
}

export async function clearHistory(): Promise<void> {
  if (sb) {
    await sb.from("watch_history").delete().eq("user_id", uid);
  }
  write("yt.history", []);
}
