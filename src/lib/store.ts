import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import type { HistoryRow, Subscription, VideoMeta, UserPlaylist, AppNotification } from "./types";

/* ------------------------------------------------------------------ */
/* Notifications: Firestore + Local Cache                             */
/* ------------------------------------------------------------------ */

export async function getNotifications(): Promise<AppNotification[]> {
  const local = read<AppNotification[]>("yt.notifs", []);
  const currentUser = auth.currentUser;
  if (!currentUser) return local;

  try {
    const q = query(
      collection(db, "users", currentUser.uid, "notifications"),
      orderBy("created_at", "desc"),
    );
    const snap = await getDocs(q);
    const remote: AppNotification[] = [];
    snap.forEach((d) => {
      const data = d.data();
      remote.push({
        id: d.id,
        video_id: data.video_id,
        title: data.title,
        thumbnail: data.thumbnail,
        channel_id: data.channel_id,
        channel_name: data.channel_name,
        channel_avatar: data.channel_avatar,
        created_at: data.created_at,
        read: data.read || false,
      });
    });

    if (remote.length > 0) {
      write("yt.notifs", remote);
      return remote;
    }
    return local;
  } catch (error) {
    return local;
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const local = read<AppNotification[]>("yt.notifs", []);
  const found = local.find((n) => n.id === id);
  if (found) {
    found.read = true;
    write("yt.notifs", local);
    window.dispatchEvent(new CustomEvent("yt:notifs-updated"));
  }

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const docRef = doc(db, "users", currentUser.uid, "notifications", id);
    await updateDoc(docRef, { read: true });
  } catch (error) {
    // Ignore update error
  }
}

export async function addNotification(notif: Omit<AppNotification, "id" | "read">): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const id = `notif_${notif.video_id}`;
  const fullNotif: AppNotification = { ...notif, id, read: false };

  // Local update
  const local = read<AppNotification[]>("yt.notifs", []);
  if (local.some((n) => n.id === id)) return; // Already exists

  local.unshift(fullNotif);
  write("yt.notifs", local.slice(0, 50));
  window.dispatchEvent(new CustomEvent("yt:notifs-updated"));

  try {
    const docRef = doc(db, "users", currentUser.uid, "notifications", id);
    await setDoc(docRef, { ...notif, read: false });
  } catch (error) {
    // Ignore save error
  }
}

/* ------------------------------------------------------------------ */
/* Local persistence (fallback and offline cache)                     */
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
  if (auth.currentUser?.uid) {
    return auth.currentUser.uid;
  }
  let id = read<string>("yt.uid", "");
  if (!id) {
    id = "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    write("yt.uid", id);
  }
  return id;
}

/* Video meta cache — derived data captured from real API responses */
export function getMeta(id: string): VideoMeta | undefined {
  return read<Record<string, VideoMeta>>("yt.meta", {})[id];
}

export function setMeta(id: string, meta: VideoMeta) {
  const all = read<Record<string, VideoMeta>>("yt.meta", {});
  all[id] = meta;
  const keys = Object.keys(all);
  if (keys.length > 400) for (const k of keys.slice(0, keys.length - 400)) delete all[k];
  write("yt.meta", all);
}

/* ------------------------------------------------------------------ */
/* Watch later + liked                                                */
/* ------------------------------------------------------------------ */

export function getLocalWatchLater(): string[] {
  return read<string[]>("yt.later", []);
}

export function setLocalWatchLater(ids: string[]) {
  write("yt.later", ids);
}

export function getLocalLiked(): string[] {
  return read<string[]>("yt.liked", []);
}

export function setLocalLiked(ids: string[]) {
  write("yt.liked", ids);
}

export function getWatchLater(): string[] {
  return getLocalWatchLater();
}

export function setWatchLater(ids: string[]) {
  setLocalWatchLater(ids);
}

export function getLiked(): string[] {
  return getLocalLiked();
}

export function setLiked(ids: string[]) {
  setLocalLiked(ids);
}

export function getBackgroundPlay(): boolean {
  return read<boolean>("yt.bgPlay", true);
}

export function setBackgroundPlay(enabled: boolean) {
  write("yt.bgPlay", enabled);
}

/* ------------------------------------------------------------------ */
/* Playback Progress: Firestore + Local Cache                         */
/* ------------------------------------------------------------------ */

export function getLocalProgress(): Record<string, number> {
  return read<Record<string, number>>("yt.progress", {});
}

export function setLocalProgress(progress: Record<string, number>) {
  write("yt.progress", progress);
}

export function savePlaybackProgress(videoId: string, seconds: number) {
  const progress = getLocalProgress();
  const current = progress[videoId] || 0;
  // Only save if progress has moved significantly (at least 5 seconds) or if it's the first save
  if (Math.abs(current - seconds) < 5) return;

  progress[videoId] = Math.floor(seconds);
  setLocalProgress(progress);

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const docPath = `users/${currentUser.uid}/history/${videoId}`;
  try {
    const docRef = doc(db, "users", currentUser.uid, "history", videoId);
    // Use updateDoc to avoid overwriting metadata if it exists, but need to handle case where doc doesn't exist
    // Actually, addHistory is usually called first.
    updateDoc(docRef, {
      progress: Math.floor(seconds),
      updatedAt: new Date().toISOString(),
    }).catch(() => {
      // If doc doesn't exist yet, we don't strictly need to create it here as addHistory will.
    });
  } catch (error) {
    // Silent fail for progress updates to avoid console noise
  }
}

export async function fetchUserProgress(): Promise<Record<string, number>> {
  const local = getLocalProgress();
  const currentUser = auth.currentUser;
  if (!currentUser) return local;

  try {
    const snap = await getDocs(collection(db, "users", currentUser.uid, "history"));
    const remote: Record<string, number> = {};
    snap.forEach((d) => {
      const data = d.data();
      if (typeof data.progress === "number") {
        remote[d.id] = data.progress;
      }
    });
    if (Object.keys(remote).length > 0) {
      const merged = { ...local, ...remote };
      setLocalProgress(merged);
      return merged;
    }
    return local;
  } catch {
    return local;
  }
}

/* ------------------------------------------------------------------ */
/* User Profile Synchronization with Firestore                        */
/* ------------------------------------------------------------------ */

export async function syncUserProfile(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}): Promise<void> {
  const userPath = `users/${user.uid}`;
  const now = new Date().toISOString();
  try {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(
      userDocRef,
      {
        userId: user.uid,
        email: user.email || "anonymous@youtube.local",
        displayName: user.displayName || "User",
        photoURL: user.photoURL || "",
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

/* ------------------------------------------------------------------ */
/* Subscriptions: Firestore + Local Cache                             */
/* ------------------------------------------------------------------ */

export async function getSubscriptions(): Promise<Subscription[]> {
  const local = read<Subscription[]>("yt.subs", []);
  const currentUser = auth.currentUser;
  if (!currentUser) return local;

  const colPath = `users/${currentUser.uid}/subscriptions`;
  try {
    const snap = await getDocs(collection(db, "users", currentUser.uid, "subscriptions"));
    const remote: Subscription[] = [];
    snap.forEach((d) => {
      const data = d.data();
      remote.push({
        channel_id: data.channelId || d.id,
        channel_name: data.channelTitle || "",
        channel_avatar_url: data.avatar,
        subscriber_count: data.subscriberCount,
        added_at: data.addedAt,
      });
    });

    if (remote.length > 0) {
      write("yt.subs", remote);
      return remote;
    }

    // If remote is empty but local has items, migrate local to Firestore
    if (local.length > 0) {
      for (const sub of local) {
        await subscribe(sub);
      }
    }
    return local;
  } catch (error) {
    console.warn("Falling back to local subscriptions:", error);
    return local;
  }
}

export async function batchSaveSubscriptions(subs: Subscription[]): Promise<Subscription[]> {
  const currentSubs = read<Subscription[]>("yt.subs", []);
  const subMap = new Map<string, Subscription>();
  currentSubs.forEach((s) => subMap.set(s.channel_id, s));
  subs.forEach((s) => subMap.set(s.channel_id, s));
  const merged = Array.from(subMap.values());
  write("yt.subs", merged);

  const currentUser = auth.currentUser;
  if (!currentUser || subs.length === 0) return merged;

  const docPath = `users/${currentUser.uid}/subscriptions`;
  try {
    const batch = writeBatch(db);
    for (const sub of subs) {
      const docRef = doc(db, "users", currentUser.uid, "subscriptions", sub.channel_id);
      batch.set(
        docRef,
        {
          channelId: sub.channel_id,
          channelTitle: sub.channel_name,
          avatar: sub.channel_avatar_url || "",
          subscriberCount: sub.subscriber_count || "",
          addedAt: sub.added_at || new Date().toISOString(),
        },
        { merge: true },
      );
    }
    await batch.commit();
  } catch (error) {
    console.warn("Failed to batch save subscriptions to Firestore:", error);
  }
  return merged;
}

export async function subscribe(sub: Subscription): Promise<void> {
  const list = read<Subscription[]>("yt.subs", []);
  if (!list.some((s) => s.channel_id === sub.channel_id)) {
    list.unshift({ ...sub, added_at: new Date().toISOString() });
    write("yt.subs", list);
  }

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const docPath = `users/${currentUser.uid}/subscriptions/${sub.channel_id}`;
  try {
    const docRef = doc(db, "users", currentUser.uid, "subscriptions", sub.channel_id);
    await setDoc(docRef, {
      channelId: sub.channel_id,
      channelTitle: sub.channel_name,
      avatar: sub.channel_avatar_url || "",
      subscriberCount: sub.subscriber_count || "",
      addedAt: sub.added_at || new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function unsubscribe(channelId: string): Promise<void> {
  write(
    "yt.subs",
    read<Subscription[]>("yt.subs", []).filter((s) => s.channel_id !== channelId),
  );

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const docPath = `users/${currentUser.uid}/subscriptions/${channelId}`;
  try {
    const docRef = doc(db, "users", currentUser.uid, "subscriptions", channelId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/* ------------------------------------------------------------------ */
/* History: Firestore + Local Cache                                   */
/* ------------------------------------------------------------------ */

export async function getHistory(): Promise<HistoryRow[]> {
  const local = read<HistoryRow[]>("yt.history", []);
  const currentUser = auth.currentUser;
  if (!currentUser) return local;

  const colPath = `users/${currentUser.uid}/history`;
  try {
    const snap = await getDocs(collection(db, "users", currentUser.uid, "history"));
    const remote: HistoryRow[] = [];
    snap.forEach((d) => {
      const data = d.data();
      remote.push({
        video_id: data.videoId || d.id,
        title: data.title || "",
        channel_name: data.channelTitle || "",
        channel_id: data.channelId || "",
        category: data.category || "",
        progress: data.progress || 0,
        thumbnail: data.thumbnail,
        duration: data.duration,
        watched_at: data.watchedAt,
      });
    });

    const mergedMap = new Map<string, HistoryRow>();
    for (const loc of local) {
      if (loc.video_id) {
        mergedMap.set(loc.video_id, loc);
      }
    }

    for (const rem of remote) {
      const loc = mergedMap.get(rem.video_id);
      if (!loc) {
        mergedMap.set(rem.video_id, rem);
      } else {
        const remTime = rem.watched_at ? new Date(rem.watched_at).getTime() : 0;
        const locTime = loc.watched_at ? new Date(loc.watched_at).getTime() : 0;
        const isRemoteNewer =
          !isNaN(remTime) && !isNaN(locTime)
            ? remTime >= locTime
            : (rem.watched_at || "").localeCompare(loc.watched_at || "") >= 0;

        if (isRemoteNewer) {
          mergedMap.set(rem.video_id, {
            ...rem,
            channel_id: rem.channel_id || loc.channel_id || "",
            category: rem.category || loc.category || "",
            progress: rem.progress || loc.progress || 0,
          });
        } else {
          mergedMap.set(rem.video_id, {
            ...loc,
            channel_id: loc.channel_id || rem.channel_id || "",
            category: loc.category || rem.category || "",
            progress: loc.progress || rem.progress || 0,
          });
        }
      }
    }

    const merged = Array.from(mergedMap.values());
    merged.sort((a, b) => (b.watched_at || "").localeCompare(a.watched_at || ""));
    write("yt.history", merged);
    return merged;
  } catch (error) {
    console.warn("Falling back to local history:", error);
    return local;
  }
}

export async function addHistory(row: HistoryRow): Promise<void> {
  const list = read<HistoryRow[]>("yt.history", []);
  const next = [row, ...list.filter((h) => h.video_id !== row.video_id)].slice(0, 200);
  write("yt.history", next);

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const docPath = `users/${currentUser.uid}/history/${row.video_id}`;
  try {
    const docRef = doc(db, "users", currentUser.uid, "history", row.video_id);
    await setDoc(docRef, {
      videoId: row.video_id,
      title: row.title || "Video",
      channelTitle: row.channel_name || "",
      channelId: row.channel_id || "",
      category: row.category || "",
      thumbnail: row.thumbnail || "",
      duration: row.duration || 0,
      progress: row.progress || 0,
      watchedAt: row.watched_at || new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function clearHistory(): Promise<void> {
  write("yt.history", []);

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const colPath = `users/${currentUser.uid}/history`;
  try {
    const snap = await getDocs(collection(db, "users", currentUser.uid, "history"));
    const batch = writeBatch(db);
    snap.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, colPath);
  }
}

/* ------------------------------------------------------------------ */
/* Watch Later & Liked Cloud Sync                                     */
/* ------------------------------------------------------------------ */

export async function syncWatchLaterToCloud(videoId: string, isSaved: boolean): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const docPath = `users/${currentUser.uid}/watchLater/${videoId}`;
  const docRef = doc(db, "users", currentUser.uid, "watchLater", videoId);
  try {
    if (isSaved) {
      const meta = getMeta(videoId);
      await setDoc(docRef, {
        videoId,
        title: meta?.title || "Video",
        channelTitle: meta?.uploaderName || "",
        thumbnail: meta?.thumbnail || "",
        duration: meta?.duration || 0,
        addedAt: new Date().toISOString(),
      });
    } else {
      await deleteDoc(docRef);
    }
  } catch (error) {
    handleFirestoreError(error, isSaved ? OperationType.WRITE : OperationType.DELETE, docPath);
  }
}

export async function syncLikedToCloud(videoId: string, isLiked: boolean): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const docPath = `users/${currentUser.uid}/liked/${videoId}`;
  const docRef = doc(db, "users", currentUser.uid, "liked", videoId);
  try {
    if (isLiked) {
      const meta = getMeta(videoId);
      await setDoc(docRef, {
        videoId,
        title: meta?.title || "Video",
        channelTitle: meta?.uploaderName || "",
        thumbnail: meta?.thumbnail || "",
        duration: meta?.duration || 0,
        addedAt: new Date().toISOString(),
      });
    } else {
      await deleteDoc(docRef);
    }
  } catch (error) {
    handleFirestoreError(error, isLiked ? OperationType.WRITE : OperationType.DELETE, docPath);
  }
}

/* ------------------------------------------------------------------ */
/* Custom User Playlists: Firestore + Local Cache                     */
/* ------------------------------------------------------------------ */

export async function getCustomPlaylists(): Promise<UserPlaylist[]> {
  const local = read<UserPlaylist[]>("yt.playlists", []);
  const currentUser = auth.currentUser;
  if (!currentUser) return local;

  try {
    const q = query(
      collection(db, "users", currentUser.uid, "playlists"),
      orderBy("updatedAt", "desc"),
    );
    const snap = await getDocs(q);
    const remote: UserPlaylist[] = [];
    snap.forEach((d) => {
      const data = d.data();
      remote.push({
        id: d.id,
        title: data.title || "Untitled Playlist",
        description: data.description || "",
        videoIds: data.videoIds || [],
        thumbnail: data.thumbnail || "",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    if (remote.length > 0) {
      write("yt.playlists", remote);
      return remote;
    }
    return local;
  } catch (error) {
    console.warn("Falling back to local playlists:", error);
    return local;
  }
}

export async function createCustomPlaylist(title: string, description = ""): Promise<UserPlaylist> {
  const now = new Date().toISOString();
  const playlist: UserPlaylist = {
    id: "pl_" + Math.random().toString(36).slice(2) + Date.now().toString(16),
    title,
    description,
    videoIds: [],
    createdAt: now,
    updatedAt: now,
  };

  const current = read<UserPlaylist[]>("yt.playlists", []);
  write("yt.playlists", [playlist, ...current]);
  window.dispatchEvent(new CustomEvent("yt:playlists-updated"));

  const currentUser = auth.currentUser;
  if (!currentUser) return playlist;

  try {
    const docRef = doc(db, "users", currentUser.uid, "playlists", playlist.id);
    await setDoc(docRef, {
      title: playlist.title,
      description: playlist.description,
      videoIds: playlist.videoIds,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `users/${currentUser.uid}/playlists/${playlist.id}`,
    );
  }
  return playlist;
}

export async function deleteCustomPlaylist(id: string): Promise<void> {
  const current = read<UserPlaylist[]>("yt.playlists", []);
  write(
    "yt.playlists",
    current.filter((p) => p.id !== id),
  );
  window.dispatchEvent(new CustomEvent("yt:playlists-updated"));

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const docRef = doc(db, "users", currentUser.uid, "playlists", id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${currentUser.uid}/playlists/${id}`);
  }
}

export async function addToPlaylist(playlistId: string, videoId: string): Promise<void> {
  const all = read<UserPlaylist[]>("yt.playlists", []);
  const pl = all.find((p) => p.id === playlistId);
  if (!pl) return;

  if (pl.videoIds.includes(videoId)) return;

  const meta = getMeta(videoId);
  pl.videoIds.push(videoId);
  pl.updatedAt = new Date().toISOString();
  if (!pl.thumbnail && meta?.thumbnail) {
    pl.thumbnail = meta.thumbnail;
  }

  write("yt.playlists", all);
  window.dispatchEvent(new CustomEvent("yt:playlists-updated"));

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const docRef = doc(db, "users", currentUser.uid, "playlists", playlistId);
    await updateDoc(docRef, {
      videoIds: pl.videoIds,
      thumbnail: pl.thumbnail || "",
      updatedAt: pl.updatedAt,
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `users/${currentUser.uid}/playlists/${playlistId}`,
    );
  }
}

export async function removeFromPlaylist(playlistId: string, videoId: string): Promise<void> {
  const all = read<UserPlaylist[]>("yt.playlists", []);
  const pl = all.find((p) => p.id === playlistId);
  if (!pl) return;

  pl.videoIds = pl.videoIds.filter((id) => id !== videoId);
  pl.updatedAt = new Date().toISOString();

  // Update thumbnail if the first video was removed
  if (pl.videoIds.length > 0) {
    const firstMeta = getMeta(pl.videoIds[0]);
    pl.thumbnail = firstMeta?.thumbnail || "";
  } else {
    pl.thumbnail = "";
  }

  write("yt.playlists", all);
  window.dispatchEvent(new CustomEvent("yt:playlists-updated"));

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const docRef = doc(db, "users", currentUser.uid, "playlists", playlistId);
    await updateDoc(docRef, {
      videoIds: pl.videoIds,
      thumbnail: pl.thumbnail || "",
      updatedAt: pl.updatedAt,
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `users/${currentUser.uid}/playlists/${playlistId}`,
    );
  }
}

export async function fetchUserWatchLater(): Promise<string[]> {
  const local = getLocalWatchLater();
  const currentUser = auth.currentUser;
  if (!currentUser) return local;

  try {
    const snap = await getDocs(collection(db, "users", currentUser.uid, "watchLater"));
    const ids: string[] = [];
    snap.forEach((d) => ids.push(d.id));
    if (ids.length > 0) {
      setLocalWatchLater(ids);
      return ids;
    }
    return local;
  } catch {
    return local;
  }
}

export async function fetchUserLiked(): Promise<string[]> {
  const local = getLocalLiked();
  const currentUser = auth.currentUser;
  if (!currentUser) return local;

  try {
    const snap = await getDocs(collection(db, "users", currentUser.uid, "liked"));
    const ids: string[] = [];
    snap.forEach((d) => ids.push(d.id));
    if (ids.length > 0) {
      setLocalLiked(ids);
      return ids;
    }
    return local;
  } catch {
    return local;
  }
}

/* ------------------------------------------------------------------ */
/* Dismissed Preferences (Not Interested / Muted Channels)            */
/* ------------------------------------------------------------------ */

export function getDismissed(): { videoIds: string[]; channelIds: string[] } {
  return read<{ videoIds: string[]; channelIds: string[] }>("yt.dismissed", {
    videoIds: [],
    channelIds: [],
  });
}

export function setDismissed(data: { videoIds: string[]; channelIds: string[] }) {
  write("yt.dismissed", data);
}

export async function fetchDismissed(): Promise<{ videoIds: string[]; channelIds: string[] }> {
  const local = getDismissed();
  const currentUser = auth.currentUser;
  if (!currentUser) return local;

  const docPath = `users/${currentUser.uid}/prefs/dismissed`;
  try {
    const docRef = doc(db, "users", currentUser.uid, "prefs", "dismissed");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const remote = {
        videoIds: Array.isArray(data.videoIds) ? data.videoIds : [],
        channelIds: Array.isArray(data.channelIds) ? data.channelIds : [],
      };
      const merged = {
        videoIds: Array.from(new Set([...local.videoIds, ...remote.videoIds])),
        channelIds: Array.from(new Set([...local.channelIds, ...remote.channelIds])),
      };
      setDismissed(merged);
      return merged;
    }
  } catch {
    // Fall back to local
  }
  return local;
}

export async function syncDismissedToCloud(data: {
  videoIds: string[];
  channelIds: string[];
}): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const docPath = `users/${currentUser.uid}/prefs/dismissed`;
  try {
    const docRef = doc(db, "users", currentUser.uid, "prefs", "dismissed");
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function dismissVideo(videoId: string): Promise<void> {
  if (!videoId) return;
  const current = getDismissed();
  if (!current.videoIds.includes(videoId)) {
    const updated = {
      ...current,
      videoIds: [videoId, ...current.videoIds],
    };
    setDismissed(updated);
    await syncDismissedToCloud(updated);
  }
}

export async function dismissChannel(channelId: string): Promise<void> {
  if (!channelId) return;
  const current = getDismissed();
  if (!current.channelIds.includes(channelId)) {
    const updated = {
      ...current,
      channelIds: [channelId, ...current.channelIds],
    };
    setDismissed(updated);
    await syncDismissedToCloud(updated);
  }
}

export async function undoDismiss(id: string): Promise<void> {
  if (!id) return;
  const current = getDismissed();
  const updated = {
    videoIds: current.videoIds.filter((v) => v !== id),
    channelIds: current.channelIds.filter((c) => c !== id),
  };
  setDismissed(updated);
  await syncDismissedToCloud(updated);
}
