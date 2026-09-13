import { useSyncExternalStore } from "react";
import type { PipedVideo, SearchFilter } from "./types";

export interface MiniplayerState {
  video: PipedVideo;
  time?: number;
}

interface AppStoreState {
  searchQ: string;
  searchFilter: SearchFilter;
  miniplayer: MiniplayerState | null;
  playbackTimes: Record<string, number>;
}

let state: AppStoreState = {
  searchQ: "",
  searchFilter: "All",
  miniplayer: null,
  playbackTimes: {},
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

  setPlaybackTime(id: string, time: number) {
    if (!id) return;
    state = {
      ...state,
      playbackTimes: { ...state.playbackTimes, [id]: Math.floor(time) },
    };
  },

  getPlaybackTime(id: string): number {
    return state.playbackTimes[id] || 0;
  },
};

export function useAppStore(): AppStoreState {
  return useSyncExternalStore(appStore.subscribe, appStore.getSnapshot, appStore.getServerSnapshot);
}
