import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import type { HistoryRow, Subscription, VideoMeta } from "./types";

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
        thumbnail: data.thumbnail,
        duration: data.duration,
        watched_at: data.watchedAt,
      });
    });

    if (remote.length > 0) {
      remote.sort((a, b) => (b.watched_at || "").localeCompare(a.watched_at || ""));
      write("yt.history", remote);
      return remote;
    }

    return local;
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
      thumbnail: row.thumbnail || "",
      duration: row.duration || 0,
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
