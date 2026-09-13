import type { Subscription } from "./types";
import { batchSaveSubscriptions, syncLikedToCloud, setLiked, getLiked } from "./store";

export interface YouTubeImportResult {
  subscriptions: Subscription[];
  importedSubsCount: number;
  importedLikedCount: number;
}

interface YouTubeSubscriptionSnippet {
  title: string;
  description: string;
  resourceId: {
    kind: string;
    channelId: string;
  };
  thumbnails?: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
}

interface YouTubeSubscriptionItem {
  id: string;
  snippet: YouTubeSubscriptionSnippet;
}

interface YouTubeSubscriptionsResponse {
  items?: YouTubeSubscriptionItem[];
  nextPageToken?: string;
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface YouTubeVideoItem {
  id: string;
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: {
      medium?: { url: string };
      high?: { url: string };
      default?: { url: string };
    };
  };
}

interface YouTubeVideosResponse {
  items?: YouTubeVideoItem[];
}

/**
 * Fetches user's subscribed channels from YouTube Data API v3.
 */
export async function fetchYouTubeSubscriptions(accessToken: string): Promise<Subscription[]> {
  const subscriptions: Subscription[] = [];
  let pageToken: string | undefined = undefined;
  let pagesFetched = 0;
  const maxPages = 4; // Fetch up to 200 subscriptions to avoid excessive latency

  do {
    const url = new URL("https://www.googleapis.com/youtube/v3/subscriptions");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("mine", "true");
    url.searchParams.set("maxResults", "50");
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn("YouTube API subscriptions response:", res.status, errorText);

      let isServiceDisabled = false;
      let disabledMessage = "";
      try {
        const errJson = JSON.parse(errorText) as {
          error?: {
            message?: string;
            details?: { reason?: string }[];
          };
        };
        if (
          errJson?.error?.message?.includes("has not been used in project") ||
          errJson?.error?.message?.includes("before or it is disabled") ||
          errJson?.error?.details?.some((d) => d.reason === "SERVICE_DISABLED")
        ) {
          isServiceDisabled = true;
          disabledMessage = errJson?.error?.message || "YouTube Data API v3 is disabled.";
        }
      } catch {
        // Ignored
      }

      if (isServiceDisabled) {
        const err = new Error(`SERVICE_DISABLED: ${disabledMessage}`);
        (err as unknown as { code: string; activationUrl: string }).code = "SERVICE_DISABLED";
        (err as unknown as { code: string; activationUrl: string }).activationUrl =
          "https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=998894461308";
        throw err;
      }
      break;
    }

    const data: YouTubeSubscriptionsResponse = await res.json();
    if (Array.isArray(data.items)) {
      for (const item of data.items) {
        const channelId = item.snippet?.resourceId?.channelId;
        const channelName = item.snippet?.title || "Channel";
        const avatar =
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          item.snippet?.thumbnails?.high?.url ||
          "";

        if (channelId) {
          subscriptions.push({
            channel_id: channelId,
            channel_name: channelName,
            channel_avatar_url: avatar,
            added_at: new Date().toISOString(),
          });
        }
      }
    }

    pageToken = data.nextPageToken;
    pagesFetched++;
  } while (pageToken && pagesFetched < maxPages);

  return subscriptions;
}

/**
 * Fetches user's liked videos from YouTube Data API v3 (up to 50 videos).
 */
export async function fetchYouTubeLikedVideos(
  accessToken: string,
): Promise<{ videoId: string; title: string; channelTitle: string; thumbnail: string }[]> {
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("myRating", "like");
    url.searchParams.set("maxResults", "50");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn("YouTube API liked videos request returned status:", res.status);
      return [];
    }

    const data: YouTubeVideosResponse = await res.json();
    if (!Array.isArray(data.items)) return [];

    return data.items.map((item) => ({
      videoId: item.id,
      title: item.snippet?.title || "Video",
      channelTitle: item.snippet?.channelTitle || "",
      thumbnail:
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        "",
    }));
  } catch (err) {
    console.warn("Could not fetch YouTube liked videos:", err);
    return [];
  }
}

/**
 * Imports user's YouTube data (subscriptions & liked videos), saving them to
 * Firestore and local state for instant personalized home feeds and library views.
 */
export async function importYouTubeUserData(accessToken: string): Promise<YouTubeImportResult> {
  const [subs, likedVideos] = await Promise.all([
    fetchYouTubeSubscriptions(accessToken),
    fetchYouTubeLikedVideos(accessToken),
  ]);

  let mergedSubs: Subscription[] = [];
  if (subs.length > 0) {
    mergedSubs = await batchSaveSubscriptions(subs);
  }

  if (likedVideos.length > 0) {
    const existingLiked = getLiked();
    const newLikedIds = likedVideos.map((v) => v.videoId);
    const combined = Array.from(new Set([...newLikedIds, ...existingLiked]));
    setLiked(combined);

    // Sync in background to cloud
    likedVideos.slice(0, 25).forEach((v) => {
      void syncLikedToCloud(v.videoId, true);
    });
  }

  return {
    subscriptions: mergedSubs.length > 0 ? mergedSubs : subs,
    importedSubsCount: subs.length,
    importedLikedCount: likedVideos.length,
  };
}

/**
 * Parses Google Takeout subscriptions.csv.
 * Expected columns: Channel Id, Channel URL, Channel Title
 */
export function parseYouTubeSubscriptionsCsv(csvContent: string): Subscription[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const results: Subscription[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip header line
    if (
      i === 0 &&
      (line.toLowerCase().includes("channel id") || line.toLowerCase().includes("channel url"))
    ) {
      continue;
    }

    // Parse CSV line taking quotes into consideration
    const parts: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        parts.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    parts.push(current.trim());

    if (parts.length >= 1) {
      let channelId = parts[0]?.replace(/^"|"$/g, "").trim();
      const title =
        parts[2]?.replace(/^"|"$/g, "").trim() ||
        parts[1]?.replace(/^"|"$/g, "").trim() ||
        "Channel";

      // If parts[0] is URL rather than ID, extract ID
      const urlMatch = (parts[1] || parts[0]).match(/channel\/(UC[a-zA-Z0-9_-]{22})/);
      if (urlMatch && urlMatch[1]) {
        channelId = urlMatch[1];
      }

      // Check if it's a valid YouTube channel ID (usually starts with UC)
      if (
        channelId &&
        (channelId.startsWith("UC") || channelId.length >= 20) &&
        !seenIds.has(channelId)
      ) {
        seenIds.add(channelId);
        results.push({
          channel_id: channelId,
          channel_name: title || channelId,
          channel_avatar_url: "",
          added_at: new Date().toISOString(),
        });
      }
    }
  }

  return results;
}

/**
 * Parses JSON subscriptions export from NewPipe, FreeTube, Invidious or Takeout.
 */
export function parseYouTubeSubscriptionsJson(jsonContent: string): Subscription[] {
  try {
    const data = JSON.parse(jsonContent);
    const results: Subscription[] = [];
    const seenIds = new Set<string>();

    const items = Array.isArray(data)
      ? data
      : Array.isArray(data.subscriptions)
        ? data.subscriptions
        : Array.isArray(data.items)
          ? data.items
          : [];

    for (const item of items) {
      const channelId =
        item.channelId ||
        item.channel_id ||
        item.id ||
        (item.url ? item.url.match(/channel\/(UC[a-zA-Z0-9_-]{22})/)?.[1] : null);
      const name = item.name || item.title || item.channelTitle || item.channel_name || "Channel";
      const avatar = item.avatar || item.channel_avatar_url || item.thumbnail || "";

      if (channelId && !seenIds.has(channelId)) {
        seenIds.add(channelId);
        results.push({
          channel_id: channelId,
          channel_name: name,
          channel_avatar_url: avatar,
          added_at: new Date().toISOString(),
        });
      }
    }

    return results;
  } catch (err) {
    console.warn("Failed to parse JSON subscriptions:", err);
    return [];
  }
}

/**
 * Parses freeform text containing YouTube channel links or channel IDs.
 */
export function parseYouTubeChannelsText(text: string): Subscription[] {
  const lines = text
    .split(/[\n,;]+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const results: Subscription[] = [];
  const seenIds = new Set<string>();

  for (const line of lines) {
    const idMatch = line.match(/(UC[a-zA-Z0-9_-]{22})/);
    const channelId = idMatch ? idMatch[1] : line.startsWith("UC") ? line : null;
    if (channelId && !seenIds.has(channelId)) {
      seenIds.add(channelId);
      results.push({
        channel_id: channelId,
        channel_name: channelId,
        channel_avatar_url: "",
        added_at: new Date().toISOString(),
      });
    }
  }

  return results;
}

/**
 * Saves an imported batch of subscriptions and notifies the application.
 */
export async function saveImportedSubscriptions(subs: Subscription[]): Promise<Subscription[]> {
  if (subs.length === 0) return [];
  const saved = await batchSaveSubscriptions(subs);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("yt:subscriptions-synced", {
        detail: {
          subscriptions: saved,
          importedSubsCount: subs.length,
          importedLikedCount: 0,
        },
      }),
    );
  }
  return saved;
}
