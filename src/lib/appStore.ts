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

export interface AppStoreState {
  searchQ: string;
  searchFilter: SearchFilter;
  miniplayer: MiniplayerState | null;
  playbackTimes: Record<string, number>;
  preferredQuality: string;
  backgroundPlay: boolean;
  route: RouteState;
  queue: PipedVideo[];
  queueIndex: number;
  autoplayNext: boolean;
}

let initialPlaybackTimes = {};
let initialQuality = "auto";
let initialQueue: PipedVideo[] = [];
let initialQueueIndex = 0;
let initialAutoplay = true;

try {
  const savedProgress = localStorage.getItem("yt.progress");
  if (savedProgress) initialPlaybackTimes = JSON.parse(savedProgress);
  const savedQuality = localStorage.getItem("yt.quality");
  if (savedQuality) initialQuality = savedQuality;
  const savedQueue = localStorage.getItem("yt.queue");
  if (savedQueue) {
    const parsed = JSON.parse(savedQueue);
    if (Array.isArray(parsed.queue)) initialQueue = parsed.queue;
    if (typeof parsed.queueIndex === "number") initialQueueIndex = parsed.queueIndex;
  }
  const savedAutoplay = localStorage.getItem("yt.autoplay");
  if (savedAutoplay !== null) initialAutoplay = JSON.parse(savedAutoplay);
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
  queue: initialQueue,
  queueIndex: initialQueueIndex,
  autoplayNext: initialAutoplay,
};

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function persistQueue(queue: PipedVideo[], queueIndex: number) {
  try {
    localStorage.setItem("yt.queue", JSON.stringify({ queue, queueIndex }));
  } catch (e) {
    // Silent fail
  }
}

function persistAutoplay(enabled: boolean) {
  try {
    localStorage.setItem("yt.autoplay", JSON.stringify(enabled));
  } catch (e) {
    // Silent fail
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

  addToQueue(v: PipedVideo) {
    if (!v) return;
    const nextQueue = [...state.queue, v];
    state = { ...state, queue: nextQueue };
    persistQueue(nextQueue, state.queueIndex);
    notify();
  },

  playNext(v: PipedVideo) {
    if (!v) return;
    const nextQueue = [...state.queue];
    if (nextQueue.length === 0) {
      nextQueue.push(v);
      state = { ...state, queue: nextQueue, queueIndex: 0 };
    } else {
      const insertAt = Math.min(state.queueIndex + 1, nextQueue.length);
      nextQueue.splice(insertAt, 0, v);
      state = { ...state, queue: nextQueue };
    }
    persistQueue(state.queue, state.queueIndex);
    notify();
  },

  removeFromQueue(index: number) {
    if (index < 0 || index >= state.queue.length) return;
    const nextQueue = state.queue.filter((_, i) => i !== index);
    let nextIndex = state.queueIndex;
    if (index < state.queueIndex) {
      nextIndex = Math.max(0, state.queueIndex - 1);
    } else if (nextIndex >= nextQueue.length) {
      nextIndex = Math.max(0, nextQueue.length - 1);
    }
    state = { ...state, queue: nextQueue, queueIndex: nextIndex };
    persistQueue(nextQueue, nextIndex);
    notify();
  },

  clearQueue() {
    state = { ...state, queue: [], queueIndex: 0 };
    persistQueue([], 0);
    notify();
  },

  setQueueIndex(index: number) {
    if (index < 0 || index >= state.queue.length) return;
    state = { ...state, queueIndex: index };
    persistQueue(state.queue, index);
    notify();
  },

  advanceQueue(): PipedVideo | null {
    if (state.queueIndex + 1 < state.queue.length) {
      const nextIndex = state.queueIndex + 1;
      const nextVideo = state.queue[nextIndex];
      state = { ...state, queueIndex: nextIndex };
      persistQueue(state.queue, nextIndex);
      notify();
      return nextVideo;
    }
    return null;
  },

  reorderQueue(newQueue: PipedVideo[], newIndex?: number) {
    const idx =
      newIndex !== undefined
        ? newIndex
        : Math.min(state.queueIndex, Math.max(0, newQueue.length - 1));
    state = { ...state, queue: newQueue, queueIndex: idx };
    persistQueue(newQueue, idx);
    notify();
  },

  setAutoplayNext(enabled: boolean) {
    if (state.autoplayNext === enabled) return;
    state = { ...state, autoplayNext: enabled };
    persistAutoplay(enabled);
    notify();
  },
};

export function useAppStore(): AppStoreState {
  return useSyncExternalStore(appStore.subscribe, appStore.getSnapshot, appStore.getServerSnapshot);
}
