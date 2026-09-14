/**
 * Server-side YouTube data layer.
 *
 * Runs only on the server (never imported by the browser), so there is no CORS
 * problem and no dependency on third-party Piped/Invidious instances: it talks
 * to YouTube's own public InnerTube endpoint directly.
 */

import type {
  ChannelData,
  PipedComment,
  PipedVideo,
  PlaylistData,
  SearchChannel,
  SearchPlaylist,
  StreamData,
} from "./types";

const INNERTUBE = "https://www.youtube.com/youtubei/v1";

const CLIENT = {
  clientName: "WEB",
  clientVersion: "2.20240401.00.00",
  hl: "ar",
  gl: "EG",
};

export async function innertube<T = Json>(
  endpoint: "search" | "browse" | "next" | "player",
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${INNERTUBE}/${endpoint}?prettyPrint=false`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept-language": "ar,en;q=0.8",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    },
    body: JSON.stringify({ context: { client: CLIENT }, ...body }),
  });
  if (!res.ok) throw new Error(`youtube ${endpoint} → HTTP ${res.status}`);
  return (await res.json()) as T;
}

/* ------------------------------------------------------------------ */
/* Generic JSON helpers                                                */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

export function collect(node: Json, key: string, out: Json[] = [], depth = 0): Json[] {
  // Prevent infinite loops from recursive structures (Youtubei sometimes has them)
  if (!node || typeof node !== "object" || depth > 20) return out;
  if (Array.isArray(node)) {
    for (const item of node) collect(item, key, out, depth + 1);
    return out;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k === key) out.push(v);
    else collect(v, key, out, depth + 1);
  }
  return out;
}

function text(node: Json): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (node.simpleText && typeof node.simpleText === "string") return node.simpleText;
  if (node.content && typeof node.content === "string") return node.content;
  if (Array.isArray(node.runs)) {
    return node.runs
      .map((r: Json) => {
        if (!r) return "";
        if (typeof r === "string") return r;
        return r.text ?? "";
      })
      .join("");
  }
  return "";
}

const WESTERN = (s: string) =>
  s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[,٬\s]/g, "");

/** "10:15" / "1:02:03" → seconds. Empty (live) → 0. */
function parseDuration(s: string): number {
  const parts = WESTERN(s).split(":").map(Number);
  if (!parts.length || parts.some(Number.isNaN)) return 0;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

const MULTIPLIERS: [RegExp, number][] = [
  [/مليار|مليارات|(?:\d|\s)b\b/i, 1_000_000_000],
  [/مليون|ملايين|(?:\d|\s)m\b/i, 1_000_000],
  [/ألف|آلاف|الاف|الف|(?:\d|\s)k\b/i, 1_000],
];

/** "1.8 مليار مشاهدة" / "43,610 مشاهدات" / "2.67 مليون مشترك" / "6 آلاف من الفيديوهات" → number. */
function parseCount(s: string): number {
  if (!s) return 0;
  let cleaned = s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  cleaned = cleaned.replace(/\u00a0/g, " ");

  const hasMultiplier = MULTIPLIERS.some(([re]) => re.test(cleaned));
  if (hasMultiplier) {
    cleaned = cleaned.replace(/٫/g, ".");
    cleaned = cleaned.replace(/(\d+),(\d+)/g, "$1.$2");
    const match = cleaned.match(/(\d+(?:\.\d+)?)/);
    if (!match) return 0;
    const val = parseFloat(match[1]);
    for (const [re, mult] of MULTIPLIERS) {
      if (re.test(cleaned)) return Math.round(val * mult);
    }
    return Math.round(val);
  } else {
    const rawDigits = cleaned.replace(/[^\d]/g, "");
    return rawDigits ? parseInt(rawDigits, 10) : 0;
  }
}

const thumbFor = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/* ------------------------------------------------------------------ */
/* Renderer parsers                                                    */
/* ------------------------------------------------------------------ */

function fromVideoRenderer(r: Json): PipedVideo | null {
  const id: string | undefined = r?.videoId;
  const title = text(r?.title);
  if (!id || !title) return null;
  const byline = r.longBylineText ?? r.ownerText ?? r.shortBylineText;
  const channelId =
    collect(byline, "browseEndpoint")[0]?.browseId ??
    collect(r, "browseEndpoint")[0]?.browseId ??
    "";

  // Robust thumbnail selection
  const thumbs = r.thumbnail?.thumbnails ?? [];
  const thumbnail = thumbs.length > 0 ? thumbs.at(-1)?.url || thumbFor(id) : thumbFor(id);

  const badgesStr = JSON.stringify(r.badges ?? []);
  const overlaysStr = JSON.stringify(r.thumbnailOverlays ?? []);
  const viewStr = text(r.viewCountText);
  const timeStr = text(r.publishedTimeText);
  const durSec = parseDuration(text(r.lengthText));

  // Determine if it is an active Live stream
  const isLive =
    badgesStr.includes("LIVE") ||
    badgesStr.includes("مباشر") ||
    badgesStr.includes("BADGE_STYLE_TYPE_LIVE_NOW") ||
    overlaysStr.includes('"style":"LIVE"') ||
    /watching|مشاهدة حالياً|يشاهد الآن/i.test(viewStr) ||
    /بث مباشر|\blive stream\b/i.test(title);

  // Determine if it is a Short
  const isShort =
    !isLive &&
    (overlaysStr.includes('"style":"SHORTS"') ||
      /#shorts\b|#short\b/i.test(title) ||
      (durSec > 0 &&
        durSec <= 60 &&
        !timeStr.includes("مباشر") &&
        !timeStr.toLowerCase().includes("live")));

  return {
    url: `/watch?v=${id}`,
    type: isLive ? "live" : isShort ? "shorts" : "stream",
    isLive,
    isShort,
    title,
    thumbnail,
    uploaderName: text(byline) || "YouTube",
    uploaderUrl: channelId ? `/channel/${channelId}` : undefined,
    uploaderAvatar: collect(r, "channelThumbnailSupportedRenderers")[0]
      ? collect(r, "thumbnails")[1]?.[0]?.url
      : undefined,
    uploaderVerified: JSON.stringify(r.ownerBadges ?? []).includes("VERIFIED"),
    uploadedDate: isLive ? "مباشر" : timeStr,
    duration: isLive ? 0 : durSec,
    views: parseCount(viewStr),
    description: text(r.detailedMetadataSnippets?.[0]?.snippetText),
  };
}

/** Newer "lockup" cards (related videos, channel grids). */
function fromLockup(r: Json): PipedVideo | null {
  const id: string | undefined = r?.contentId;
  const meta = r?.metadata?.lockupMetadataViewModel;
  const title = text(meta?.title);
  if (!id || !title || r?.contentType !== "LOCKUP_CONTENT_TYPE_VIDEO") return null;

  const rows: Json[] = collect(meta?.metadata, "metadataRows")[0] ?? [];
  const parts = (i: number): Json[] => rows[i]?.metadataParts ?? [];

  let channelName = "";
  let views = 0;
  let uploadedDate = "";

  if (rows.length >= 2) {
    // Search / Home: Row 0 is channel name, Row 1 is views and uploaded date
    channelName = text(parts(0)[0]?.text);
    views = parseCount(text(parts(1)[0]?.text));
    uploadedDate = text(parts(1)[1]?.text);
  } else if (rows.length === 1) {
    // Channel videos tab: Row 0 has views and uploaded date!
    const row0 = parts(0);
    views = parseCount(text(row0[0]?.text));
    uploadedDate = text(row0[1]?.text);
  }

  const badge = collect(r.contentImage, "thumbnailBadgeViewModel")[0];
  const badgeText = (badge?.text ?? "").trim();
  const contentImageStr = JSON.stringify(r.contentImage ?? "");

  const isLive =
    /LIVE|مباشر|بث مباشر/i.test(badgeText) ||
    contentImageStr.includes('"style":"LIVE"') ||
    /بث مباشر|\blive stream\b/i.test(title);

  const durSec = isLive ? 0 : parseDuration(badgeText);
  const isShort =
    !isLive &&
    (r.contentType === "LOCKUP_CONTENT_TYPE_SHORTS" ||
      /#shorts\b|#short\b/i.test(title) ||
      (durSec > 0 && durSec <= 60));

  const channelId = collect(meta?.image, "browseEndpoint")[0]?.browseId ?? "";

  return {
    url: `/watch?v=${id}`,
    type: isLive ? "live" : isShort ? "shorts" : "stream",
    isLive,
    isShort,
    title,
    thumbnail: collect(r.contentImage, "sources")[0]?.at(-1)?.url ?? thumbFor(id),
    uploaderName: channelName,
    uploaderUrl: channelId ? `/channel/${channelId}` : undefined,
    uploaderAvatar: collect(meta?.image, "sources")[0]?.[0]?.url,
    uploadedDate: isLive ? "مباشر" : uploadedDate,
    duration: isLive ? 0 : durSec,
    views,
  };
}

const https = (u?: string) => (u ? (u.startsWith("//") ? `https:${u}` : u) : "");

function fromChannelRenderer(r: Json): SearchChannel | null {
  const id: string | undefined = r?.channelId;
  const name = text(r?.title);
  if (!id || !name) return null;
  const subsLabel = [text(r.videoCountText), text(r.subscriberCountText)].find((s) =>
    /مشترك|subscrib/i.test(s),
  );
  return {
    id,
    name,
    avatar: https(r?.thumbnail?.thumbnails?.at(-1)?.url),
    subscribers: parseCount(subsLabel ?? text(r.subscriberCountText)),
    description: text(r.descriptionSnippet),
    verified: JSON.stringify(r.ownerBadges ?? []).includes("VERIFIED"),
  };
}

function fromPlaylistRenderer(r: Json): SearchPlaylist | null {
  const id: string | undefined = r?.playlistId;
  const title = text(r?.title);
  if (!id || !title) return null;
  const firstVideoId = collect(r, "videoId")[0];
  return {
    id,
    title,
    thumbnail:
      https(collect(r, "thumbnails")[0]?.at?.(-1)?.url) ||
      (firstVideoId ? thumbFor(firstVideoId) : ""),
    videoCount: parseCount(String(r.videoCount ?? text(r.videoCountText) ?? "")),
    uploaderName: text(r.longBylineText ?? r.shortBylineText),
    firstVideoId,
  };
}

/** Newer playlist "lockup" cards. */
function fromPlaylistLockup(r: Json): SearchPlaylist | null {
  const id: string | undefined = r?.contentId;
  const meta = r?.metadata?.lockupMetadataViewModel;
  const title = text(meta?.title);
  if (!id || !title || r?.contentType !== "LOCKUP_CONTENT_TYPE_PLAYLIST") return null;
  const rows: Json[] = collect(meta?.metadata, "metadataRows")[0] ?? [];
  const badge = collect(r.contentImage, "thumbnailOverlayBadgeViewModel")[0];
  return {
    id,
    title,
    thumbnail: https(collect(r.contentImage, "sources")[0]?.at(-1)?.url),
    videoCount: parseCount(text(collect(badge, "text")[0]) || ""),
    uploaderName: text(rows[0]?.metadataParts?.[0]?.text),
  };
}

/** Channel cards inside any search response. */
function extractChannels(payload: Json): SearchChannel[] {
  const out: SearchChannel[] = [];
  const seen = new Set<string>();
  for (const r of collect(payload, "channelRenderer")) {
    const c = fromChannelRenderer(r);
    if (c && !seen.has(c.id)) {
      seen.add(c.id);
      out.push(c);
    }
  }
  return out;
}

/** Playlist cards inside any search response. */
function extractPlaylists(payload: Json): SearchPlaylist[] {
  const out: SearchPlaylist[] = [];
  const seen = new Set<string>();
  const push = (p: SearchPlaylist | null) => {
    if (!p || seen.has(p.id) || !p.thumbnail) return;
    seen.add(p.id);
    out.push(p);
  };
  for (const r of collect(payload, "playlistRenderer")) push(fromPlaylistRenderer(r));
  for (const r of collect(payload, "gridPlaylistRenderer")) push(fromPlaylistRenderer(r));
  for (const r of collect(payload, "lockupViewModel")) push(fromPlaylistLockup(r));
  return out;
}

function fromReelItem(r: Json): PipedVideo | null {
  const id: string | undefined = r?.videoId;
  const title = text(r?.headline);
  if (!id || !title) return null;
  return {
    url: `/watch?v=${id}`,
    type: "shorts",
    isShort: true,
    isLive: false,
    title,
    thumbnail: r.thumbnail?.thumbnails?.at(-1)?.url ?? thumbFor(id),
    uploaderName: text(r.navigationEndpoint?.reelWatchEndpoint?.channelName) || "Shorts",
    duration: 30,
    views: parseCount(text(r.viewCountText)),
  };
}

function fromShortsLockup(s: Json): PipedVideo | null {
  if (!s) return null;
  const videoId: string =
    s.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId ||
    s.entityId?.replace("shorts-shelf-item-", "") ||
    "";
  if (!videoId) return null;
  const title = text(s.overlayMetadata?.primaryText?.content) || "Shorts";
  const views = parseCount(text(s.overlayMetadata?.secondaryText?.content));
  const thumb =
    s.thumbnail?.sources?.at(-1)?.url ||
    s.onTap?.innertubeCommand?.reelWatchEndpoint?.thumbnail?.thumbnails?.at(-1)?.url ||
    thumbFor(videoId);

  return {
    url: `/watch?v=${videoId}`,
    type: "shorts",
    isShort: true,
    isLive: false,
    title,
    thumbnail: thumb,
    uploaderName: "Shorts",
    duration: 30,
    views,
  };
}

/** Pull every playable video card out of any InnerTube response. */
function extractVideos(payload: Json): PipedVideo[] {
  const out: PipedVideo[] = [];
  const seen = new Set<string>();
  const push = (v: PipedVideo | null) => {
    if (!v) return;
    const id = v.url.includes("=") ? v.url.slice(v.url.indexOf("=") + 1) : v.url.split("/").at(-1);
    if (!id || seen.has(id)) return;
    seen.add(id);
    out.push(v);
  };
  for (const r of collect(payload, "videoRenderer")) push(fromVideoRenderer(r));
  for (const r of collect(payload, "gridVideoRenderer")) push(fromVideoRenderer(r));
  for (const r of collect(payload, "compactVideoRenderer")) push(fromVideoRenderer(r));
  for (const r of collect(payload, "lockupViewModel")) push(fromLockup(r));
  for (const r of collect(payload, "playlistVideoRenderer")) push(fromVideoRenderer(r));
  for (const r of collect(payload, "reelItemRenderer")) push(fromReelItem(r));
  for (const r of collect(payload, "shortsLockupViewModel")) push(fromShortsLockup(r));
  return out;
}

/* ------------------------------------------------------------------ */
/* Public operations                                                   */
/* ------------------------------------------------------------------ */

/** filter=videos */
const SEARCH_VIDEOS = "EgIQAQ%3D%3D";
/** filter=videos + sort by view count + uploaded this week */
const SEARCH_HOT = "CAMSBQgDEAE%3D";

export interface Page {
  items: PipedVideo[];
  /** Token for the next page, or null when exhausted. */
  continuation: string | null;
  /** Channel cards found on this page (search only). */
  channels: SearchChannel[];
  /** Playlist cards found on this page (search only). */
  playlists: SearchPlaylist[];
}

function continuationToken(payload: Json): string | null {
  // 1. Look for continuationItemRenderer first (standard for list pagination)
  const items = collect(payload, "continuationItemRenderer");
  for (const item of items) {
    const token =
      item?.continuationEndpoint?.continuationCommand?.token ?? item?.continuationCommand?.token;
    if (typeof token === "string" && token.length > 10) return token;
  }

  // 2. Fallback to any continuationCommand
  const tokens = collect(payload, "continuationCommand")
    .map((c: Json) => c?.token)
    .filter((t: unknown): t is string => typeof t === "string" && t.length > 10);
  if (tokens.length) return tokens.at(-1) ?? null;

  // 3. Legacy fallbacks
  const legacy = collect(payload, "nextContinuationData");
  if (legacy.length) return legacy[0]?.continuation ?? null;

  return null;
}

export async function search(query: string, params = SEARCH_VIDEOS): Promise<PipedVideo[]> {
  return (await searchPage(query, params)).items;
}

/**
 * One page of search results; pass `continuation` to get the next page.
 * With no `params` the results are mixed (videos + channels + playlists),
 * exactly like youtube.com.
 */
export async function searchPage(
  query: string,
  params = "",
  continuation?: string | null,
): Promise<Page> {
  const data = await innertube(
    "search",
    continuation ? { continuation } : { query, ...(params ? { params } : {}) },
  );
  return {
    items: extractVideos(data),
    continuation: continuationToken(data),
    channels: extractChannels(data),
    playlists: extractPlaylists(data),
  };
}

/** All videos of a playlist. */
export async function playlist(id: string): Promise<PlaylistData> {
  const browseId = id.startsWith("VL") ? id : `VL${id}`;
  const data = await innertube("browse", { browseId });
  const header =
    collect(data, "playlistHeaderRenderer")[0] ?? collect(data, "pageHeaderViewModel")[0] ?? {};
  const meta = collect(data, "microformatDataRenderer")[0] ?? {};
  const videos = extractVideos(data);
  const title =
    text(header.title) ||
    text(collect(header, "dynamicTextViewModel")[0]?.text) ||
    meta.title ||
    "قائمة تشغيل";
  return {
    id: browseId.replace(/^VL/, ""),
    title,
    thumbnail: https(collect(header, "thumbnails")[0]?.at?.(-1)?.url) || videos[0]?.thumbnail || "",
    videoCount: parseCount(text(header.numVideosText)) || videos.length,
    uploaderName: text(header.ownerText) || text(collect(header, "ownerText")[0]),
    description: meta.description ?? text(header.descriptionText),
    videos,
  };
}

const TRENDING_QUERIES = ["مصر", "الأكثر مشاهدة", "trailer", "music"];

export interface TrendingPage {
  items: PipedVideo[];
  /** One continuation per source query (null = exhausted). */
  cursors: (string | null)[];
}

function interleave(lists: PipedVideo[][]): PipedVideo[] {
  const merged: PipedVideo[] = [];
  const seen = new Set<string>();
  const depth = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < depth; i++) {
    for (const list of lists) {
      const v = list[i];
      if (!v || seen.has(v.url)) continue;
      seen.add(v.url);
      merged.push(v);
    }
  }
  return merged;
}

/**
 * YouTube retired the public "trending" browse feed for anonymous clients, so
 * the hot list is rebuilt from most-viewed uploads of the last week.
 * `cursors` (from a previous page) fetches the next page of every source.
 */
export async function trendingPage(cursors?: (string | null)[]): Promise<TrendingPage> {
  const batches = await Promise.allSettled(
    TRENDING_QUERIES.map((q, i) => {
      if (cursors) {
        const c = cursors[i];
        return c
          ? searchPage(q, SEARCH_HOT, c)
          : Promise.resolve<Page>({ items: [], continuation: null, channels: [], playlists: [] });
      }
      return searchPage(q, SEARCH_HOT);
    }),
  );
  const pages = batches.map((b) =>
    b.status === "fulfilled"
      ? b.value
      : ({ items: [], continuation: null, channels: [], playlists: [] } as Page),
  );
  const items = interleave(pages.map((p) => p.items));
  if (!items.length && !cursors) throw new Error("trending unavailable");
  return { items, cursors: pages.map((p) => p.continuation) };
}

export async function trending(): Promise<PipedVideo[]> {
  return (await trendingPage()).items;
}

export async function suggest(query: string): Promise<string[]> {
  // `oe=utf-8` is required: without it YouTube answers in windows-1256 and
  // every Arabic suggestion comes back as mojibake.
  const res = await fetch(
    `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&hl=ar&gl=eg&oe=utf-8&q=${encodeURIComponent(query)}`,
  );
  if (!res.ok) return [];
  const body = await res.text();
  const json = body.slice(body.indexOf("(") + 1, body.lastIndexOf(")"));
  try {
    const parsed = JSON.parse(json) as [string, [string][]];
    return (parsed[1] || []).map((row) => row[0]).slice(0, 10);
  } catch {
    return [];
  }
}

function parseCommentEntities(data: Json): PipedComment[] {
  const fromEntities = collect(data, "commentEntityPayload")
    .map((c: Json) => ({
      author: c?.author?.displayName ?? "",
      thumbnail: c?.author?.avatarThumbnailUrl ?? "",
      commentText: c?.properties?.content?.content ?? "",
      commentedTime: c?.properties?.publishedTime ?? "",
      likeCount: parseCount(c?.toolbar?.likeCountLiked ?? c?.toolbar?.likeCountNotliked ?? ""),
      replyCount: parseCount(c?.toolbar?.replyCount ?? ""),
    }))
    .filter((c) => c.commentText);

  if (fromEntities.length > 0) return fromEntities;

  return collect(data, "commentRenderer")
    .map((c: Json) => ({
      author: text(c?.authorText) || "",
      thumbnail: c?.authorThumbnail?.thumbnails?.at(-1)?.url || "",
      commentText: text(c?.contentText) || "",
      commentedTime: text(c?.publishedTimeText) || "",
      likeCount: parseCount(text(c?.voteCount) || ""),
      replyCount: parseCount(text(c?.replyCount) || ""),
    }))
    .filter((c) => c.commentText);
}

function extractCommentsTotalCount(data: Json): number {
  const header = collect(data, "commentsHeaderRenderer")[0];
  if (header) {
    const countText = text(header?.countText) || text(header?.commentsCount);
    const count = parseCount(countText);
    if (count > 0) return count;
  }
  try {
    const str = JSON.stringify(data);
    const m =
      str.match(/"countText":\{"runs":\[\{"text":"([^"]+)"\}/) ||
      str.match(/"commentsCount":\{"runs":\[\{"text":"([^"]+)"\}/);
    if (m && m[1]) {
      const c = parseCount(m[1]);
      if (c > 0) return c;
    }
  } catch {
    // ignore parse error
  }
  return 0;
}

function findNextCommentsToken(data: Json): string | undefined {
  const items = collect(data, "continuationItemRenderer");
  for (const item of items) {
    const token = item?.continuationEndpoint?.continuationCommand?.token;
    if (token && (token.includes("comments-section") || !token.includes("replies"))) {
      return token;
    }
  }
  return undefined;
}

export async function fetchComments(
  token: string,
  fetchMultiplePages = true,
): Promise<{ items: PipedComment[]; totalCount: number; nextContinuation?: string }> {
  try {
    const p1 = await innertube("next", { continuation: token });
    const totalCount = extractCommentsTotalCount(p1);
    const items = parseCommentEntities(p1);
    let nextCont = findNextCommentsToken(p1);

    if (fetchMultiplePages && nextCont && items.length > 0) {
      try {
        const p2 = await innertube("next", { continuation: nextCont });
        const p2Items = parseCommentEntities(p2);
        items.push(...p2Items);
        nextCont = findNextCommentsToken(p2) || nextCont;
      } catch {
        // ignore secondary page fetch error
      }
    }

    return { items, totalCount, nextContinuation: nextCont };
  } catch {
    return { items: [], totalCount: 0 };
  }
}

/** Everything the watch page needs. Playback itself uses the YouTube player. */
export async function videoDetails(videoId: string): Promise<StreamData> {
  const next = await innertube("next", { videoId });

  const primary = collect(next, "videoPrimaryInfoRenderer")[0] ?? {};
  const secondary = collect(next, "videoSecondaryInfoRenderer")[0] ?? {};
  const owner = collect(secondary, "videoOwnerRenderer")[0] ?? {};

  const title = text(primary.title);
  if (!title) throw new Error("video unavailable");

  // Accurate like count extraction from modern InnerTube view models, entities, and factoids
  let likes = 0;
  const likeEntities = collect(next, "likeCountEntity");
  for (const ent of likeEntities) {
    if (ent.likeCountIfIndifferentNumber != null) {
      likes = Number(ent.likeCountIfIndifferentNumber) || 0;
      if (likes > 0) break;
    }
    if (ent.expandedLikeCountIfIndifferent?.content) {
      likes = parseCount(ent.expandedLikeCountIfIndifferent.content);
      if (likes > 0) break;
    }
    if (ent.likeCountIfIndifferent?.content) {
      likes = parseCount(ent.likeCountIfIndifferent.content);
      if (likes > 0) break;
    }
    if (ent.likeCountIfLikedNumber != null) {
      likes = Number(ent.likeCountIfLikedNumber) || 0;
      if (likes > 0) break;
    }
    if (ent.likeButtonA11yText?.content) {
      likes = parseCount(ent.likeButtonA11yText.content);
      if (likes > 0) break;
    }
  }

  // Check likeButtonViewModel & segmentedLikeDislikeButtonViewModel
  if (!likes) {
    const likeButtonVMs = collect(next, "likeButtonViewModel");
    for (const vm of likeButtonVMs) {
      const buttonVMs = collect(vm, "buttonViewModel");
      for (const b of buttonVMs) {
        if (b.accessibilityText && /\d/.test(b.accessibilityText)) {
          const v = parseCount(b.accessibilityText);
          if (v > 0) {
            likes = v;
            break;
          }
        }
        if (b.title && /\d/.test(b.title)) {
          const v = parseCount(b.title);
          if (v > 0) {
            likes = v;
            break;
          }
        }
      }
      if (likes > 0) break;
    }
  }

  // Check any buttonViewModel with like ID or action
  if (!likes) {
    const allButtons = collect(next, "buttonViewModel");
    for (const b of allButtons) {
      if (b.accessibilityId === "id.video.like.button" || /like/i.test(b.accessibilityId ?? "")) {
        if (b.accessibilityText && /\d/.test(b.accessibilityText)) {
          const v = parseCount(b.accessibilityText);
          if (v > 0) {
            likes = v;
            break;
          }
        }
        if (b.title && /\d/.test(b.title)) {
          const v = parseCount(b.title);
          if (v > 0) {
            likes = v;
            break;
          }
        }
      }
    }
  }

  // Check FactoidRenderer
  if (!likes) {
    const factoids = collect(next, "factoidRenderer");
    for (const f of factoids) {
      const lbl = f?.label?.simpleText || f?.accessibilityText || "";
      if (/معجب|إعجاب|like/i.test(lbl)) {
        likes = parseCount(f?.value?.simpleText || f?.accessibilityText);
        if (likes > 0) break;
      }
    }
  }

  // Check Legacy toggleButtonRenderer / likeButton
  if (!likes) {
    const legacyButtons = collect(primary, "likeButton");
    for (const lb of legacyButtons) {
      const label =
        text(lb?.toggleButtonRenderer?.defaultText) ??
        text(lb?.toggleButtonRenderer?.accessibility?.label);
      const v = parseCount(label ?? "");
      if (v > 0) {
        likes = v;
        break;
      }
    }
  }

  // Accurate date extraction (exact date & relative date)
  const rawRelDate =
    text(primary.relativeDateText?.accessibility?.accessibilityData?.label) ||
    text(primary.relativeDateText);
  const rawDateText = text(collect(primary, "dateText")[0]) || text(primary.dateText);

  // Check factoid date for clean spelled-out date (e.g. "24 أكتوبر 2009")
  const factoids = collect(next, "factoidRenderer");
  let factoidDate = "";
  for (const f of factoids) {
    const val = text(f?.value);
    const lbl = text(f?.label);
    if (/\d{4}/.test(val) && lbl) {
      factoidDate = `${lbl} ${val}`.trim();
      break;
    }
  }

  const uploadDate = factoidDate || rawDateText || rawRelDate || "";
  const relativeDate = rawRelDate || "";

  const channelId = owner?.navigationEndpoint?.browseEndpoint?.browseId ?? "";

  const related = extractVideos(collect(next, "secondaryResults")[0] ?? {});

  const allTokens = collect(next, "continuationItemRenderer")
    .map((c: Json) => c?.continuationEndpoint?.continuationCommand?.token)
    .filter(Boolean);

  const commentToken =
    allTokens.find((t: string) => {
      try {
        return decodeURIComponent(t).includes("comments-section");
      } catch {
        return false;
      }
    }) || allTokens[0];

  const commentsData = commentToken
    ? await fetchComments(commentToken, true)
    : { items: [], totalCount: 0 };

  return {
    title,
    description:
      text(collect(secondary, "attributedDescription")[0]) || text(secondary.description),
    uploadDate,
    relativeDate,
    category: "",
    likes,
    views: parseCount(text(collect(primary, "videoViewCountRenderer")[0]?.viewCount)),
    uploader: text(owner.title),
    uploaderUrl: channelId ? `/channel/${channelId}` : "",
    uploaderAvatar: owner?.thumbnail?.thumbnails?.at(-1)?.url ?? "",
    uploaderVerified: JSON.stringify(owner.badges ?? []).includes("VERIFIED"),
    uploaderSubscriberCount: parseCount(text(owner.subscriberCountText)),
    videoStreams: [],
    relatedStreams: related,
    comments: commentsData.items,
    commentCount: commentsData.totalCount,
    commentsContinuation: commentsData.nextContinuation,
  };
}

export async function getCommentsPage(
  token: string,
): Promise<{ items: PipedComment[]; nextContinuation?: string }> {
  const res = await fetchComments(token, false);
  return { items: res.items, nextContinuation: res.nextContinuation };
}

/** Videos tab of a channel (accepts UC… id or @handle). */
export async function channel(input: string): Promise<ChannelData> {
  const raw = input.trim();
  let browseId = raw.startsWith("UC") ? raw : "";

  if (!browseId) {
    const handle = raw.replace(/^\/?(c\/|user\/|channel\/)?@?/, "");
    const found = await innertube("search", {
      query: handle,
      params: "EgIQAg%3D%3D", // filter = channels
    });
    browseId =
      collect(found, "channelRenderer")[0]?.channelId ??
      collect(found, "browseEndpoint").find((b: Json) => b?.browseId?.startsWith("UC"))?.browseId ??
      "";
    if (!browseId) throw new Error("channel not found");
  }

  const [vidsResult, shortsResult] = await Promise.allSettled([
    innertube("browse", { browseId, params: "EgZ2aWRlb3PyBgQKAjoA" }),
    innertube("browse", { browseId, params: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D" }),
  ]);

  const data = vidsResult.status === "fulfilled" ? vidsResult.value : {};
  const shortsData = shortsResult.status === "fulfilled" ? shortsResult.value : {};

  const header =
    collect(data, "c4TabbedHeaderRenderer")[0] ?? collect(data, "pageHeaderViewModel")[0] ?? {};
  const meta = collect(data, "microformatDataRenderer")[0] ?? {};

  const name =
    text(header.title) ||
    text(collect(header, "dynamicTextViewModel")[0]?.text) ||
    meta.title ||
    "";

  const avatar =
    header?.avatar?.thumbnails?.at(-1)?.url ??
    collect(header, "avatarViewModel")[0]?.image?.sources?.at(-1)?.url ??
    meta.thumbnail?.thumbnails?.at(-1)?.url ??
    "";

  const banner =
    header?.banner?.thumbnails?.at(-1)?.url ??
    collect(header, "banner")[0]?.imageBannerViewModel?.image?.sources?.at(-1)?.url;

  const metaParts = collect(header, "metadataParts").flat();
  const subsPart = metaParts.find((p: Json) =>
    /مشترك|subscri/i.test(text(p?.text) || text(p?.accessibilityLabel)),
  );
  const vidsPart = metaParts.find((p: Json) =>
    /فيديو|video/i.test(text(p?.text) || text(p?.accessibilityLabel)),
  );

  const subscriberText =
    text(subsPart?.text) ||
    text(subsPart?.accessibilityLabel) ||
    text(header.subscriberCountText) ||
    "";
  const videoCountText =
    text(vidsPart?.text) ||
    text(vidsPart?.accessibilityLabel) ||
    text(header.videosCountText) ||
    text(header.videoCountText) ||
    "";

  const subscriberCount = parseCount(subscriberText);
  const videoCount = parseCount(videoCountText);

  // Extract channel videos and make sure uploader metadata is set
  const videos = extractVideos(data).map((v) => ({
    ...v,
    uploaderName: v.uploaderName || name,
    uploaderAvatar: v.uploaderAvatar || avatar,
    uploaderUrl: v.uploaderUrl || `/channel/${browseId}`,
  }));

  // Extract channel shorts
  const shorts = extractVideos(shortsData).map((s) => ({
    ...s,
    uploaderName: name,
    uploaderAvatar: avatar,
    uploaderUrl: `/channel/${browseId}`,
  }));

  return {
    id: browseId,
    name,
    avatarUrl: avatar,
    bannerUrl: banner,
    subscriberCount: subscriberCount || undefined,
    subscriberText: subscriberText || undefined,
    videoCount: videoCount || undefined,
    videoCountText: videoCountText || undefined,
    description: meta.description ?? "",
    verified: JSON.stringify(header.badges ?? []).includes("VERIFIED"),
    relatedStreams: videos,
    shorts,
    nextVideos: continuationToken(data),
    nextShorts: continuationToken(shortsData),
  };
}

/** Fetch a generic continuation page (works for channel tabs, playlists, etc). */
export async function browsePage(continuation: string): Promise<Page> {
  const data = await innertube("browse", { continuation });
  return {
    items: extractVideos(data),
    continuation: continuationToken(data),
    channels: [],
    playlists: [],
  };
}
