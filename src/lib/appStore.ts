import { useSyncExternalStore } from "react";
import type { PipedVideo, SearchFilter } from "./types";

export interface MiniplayerState {
  video: PipedVideo;
  time?: number;
}

export type LibraryKey =
  | "السجل"
  | "History"
  | "المشاهدة لاحقاً"
  | "Watch Later"
  | "مقاطع أعجبتني"
  | "Liked Videos"
  | "قوائم التشغيل"
  | "Playlists"
  | "مقاطع الفيديو"
  | "Your Videos"
  | "الرائج"
  | "Trending"
  | "الموسيقى"
  | "Music"
  | "الألعاب"
  | "Gaming"
  | "الأخبار"
  | "News"
  | "الرياضة"
  | "Sports";

export type RouteState =
  | { type: "home" }
  | { type: "watch"; video: PipedVideo }
  | { type: "channel"; id: string }
  | { type: "playlist"; id: string }
  | { type: "subs" }
  | { type: "library"; key: LibraryKey }
  | { type: "policies" };

interface AppStoreState {
  searchQ: string;
  searchFilter: SearchFilter;
  miniplayer: MiniplayerState | null;
  playbackTimes: Record<string, number>;
  preferredQuality: string;
  backgroundPlay: boolean;
  route: RouteState;
}

let initialPlaybackTimes = {};
let initialQuality = "auto";
try {
  const savedProgress = localStorage.getItem("yt.progress");
  if (savedProgress) initialPlaybackTimes = JSON.parse(savedProgress);
  const savedQuality = localStorage.getItem("yt.quality");
  if (savedQuality) initialQuality = savedQuality;
} catch (e) {
  // Silent fail
}

let state: AppStoreState = {
  searchQ: "",
  searchFilter: "All",
  miniplayer: null,
  playbackTimes: initialPlaybackTimes,
  preferredQuality: initialQuality,
  backgroundPlay: true,
  route: { type: "home" },
};

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export const appStore = {
  getSnapshot(): AppStoreState {
    return state;
  },

  getServerSnapshot(): AppStoreState {
    return state;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setSearchQ(q: string) {
    if (state.searchQ === q) return;
    state = { ...state, searchQ: q };
    notify();
  },

  setSearchFilter(f: SearchFilter) {
    if (state.searchFilter === f) return;
    state = { ...state, searchFilter: f };
    notify();
  },

  setMiniplayer(m: MiniplayerState | null) {
    state = { ...state, miniplayer: m };
    notify();
  },

  setBackgroundPlay(enabled: boolean) {
    if (state.backgroundPlay === enabled) return;
    state = { ...state, backgroundPlay: enabled };
    notify();
  },

  setPreferredQuality(q: string) {
    if (state.preferredQuality === q) return;
    state = { ...state, preferredQuality: q };
    try {
      localStorage.setItem("yt.quality", q);
    } catch (e) {
      // ignore
    }
    notify();
  },

  setRoute(r: RouteState | ((prev: RouteState) => RouteState)) {
    const next = typeof r === "function" ? r(state.route) : r;
    if (JSON.stringify(state.route) === JSON.stringify(next)) return;
    state = { ...state, route: next };
    notify();
  },

  setPlaybackTime(id: string, time: number) {
    if (!id) return;
    const nextTimes = { ...state.playbackTimes, [id]: Math.floor(time) };
    state = {
      ...state,
      playbackTimes: nextTimes,
    };
    try {
      localStorage.setItem("yt.progress", JSON.stringify(nextTimes));
    } catch (e) {
      // Silent fail
    }
  },

  getPlaybackTime(id: string): number {
    return state.playbackTimes[id] || 0;
  },
};

export function useAppStore(): AppStoreState {
  return useSyncExternalStore(appStore.subscribe, appStore.getSnapshot, appStore.getServerSnapshot);
}
