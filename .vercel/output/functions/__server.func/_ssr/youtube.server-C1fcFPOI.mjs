//#region node_modules/.nitro/vite/services/ssr/assets/youtube.server-C1fcFPOI.js
var INNERTUBE = "https://www.youtube.com/youtubei/v1";
var CLIENT = {
	clientName: "WEB",
	clientVersion: "2.20240401.00.00",
	hl: "ar",
	gl: "EG"
};
var cache = /* @__PURE__ */ new Map();
async function cached(key, ttlMs, fn) {
	const now = Date.now();
	const entry = cache.get(key);
	if (entry) {
		const age = now - entry.at;
		if (age < ttlMs) return entry.data;
		if (age < ttlMs * 4) {
			if (!entry.inflight) entry.inflight = fn().then((fresh) => {
				entry.at = Date.now();
				entry.data = fresh;
				return fresh;
			}).catch((err) => {
				console.warn(`Background revalidation failed for ${key}:`, err);
				return entry.data;
			}).finally(() => {
				entry.inflight = void 0;
			});
			return entry.data;
		}
		if (entry.inflight) return await entry.inflight;
	}
	const placeholder = entry || {
		at: 0,
		data: void 0
	};
	const promise = (async () => {
		const data = await fn();
		placeholder.at = Date.now();
		placeholder.data = data;
		return data;
	})();
	placeholder.inflight = promise;
	cache.set(key, placeholder);
	if (cache.size > 500) {
		const oldestKey = cache.keys().next().value;
		if (oldestKey !== void 0) cache.delete(oldestKey);
	}
	try {
		return await promise;
	} finally {
		placeholder.inflight = void 0;
	}
}
async function innertube(endpoint, body) {
	const res = await fetch(`${INNERTUBE}/${endpoint}?prettyPrint=false`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"accept-language": "ar,en;q=0.8",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
		},
		body: JSON.stringify({
			context: { client: CLIENT },
			...body
		})
	});
	if (!res.ok) throw new Error(`youtube ${endpoint} → HTTP ${res.status}`);
	return await res.json();
}
function collect(node, key, out = [], depth = 0) {
	if (!node || typeof node !== "object" || depth > 20) return out;
	if (Array.isArray(node)) {
		for (const item of node) collect(item, key, out, depth + 1);
		return out;
	}
	for (const [k, v] of Object.entries(node)) if (k === key) out.push(v);
	else collect(v, key, out, depth + 1);
	return out;
}
function text(node) {
	if (!node) return "";
	if (typeof node === "string") return node;
	if (node.simpleText && typeof node.simpleText === "string") return node.simpleText;
	if (node.content && typeof node.content === "string") return node.content;
	if (Array.isArray(node.runs)) return node.runs.map((r) => {
		if (!r) return "";
		if (typeof r === "string") return r;
		return r.text ?? "";
	}).join("");
	return "";
}
var WESTERN = (s) => s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[,٬\s]/g, "");
/** "10:15" / "1:02:03" → seconds. Empty (live) → 0. */
function parseDuration(s) {
	const parts = WESTERN(s).split(":").map(Number);
	if (!parts.length || parts.some(Number.isNaN)) return 0;
	return parts.reduce((acc, p) => acc * 60 + p, 0);
}
var MULTIPLIERS = [
	[/مليار|مليارات|(?:\d|\s)b\b/i, 1e9],
	[/مليون|ملايين|(?:\d|\s)m\b/i, 1e6],
	[/ألف|آلاف|الاف|الف|(?:\d|\s)k\b/i, 1e3]
];
/** "1.8 مليار مشاهدة" / "43,610 مشاهدات" / "2.67 مليون مشترك" / "6 آلاف من الفيديوهات" → number. */
function parseCount(s) {
	if (!s) return 0;
	let cleaned = s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
	cleaned = cleaned.replace(/\u00a0/g, " ");
	if (MULTIPLIERS.some(([re]) => re.test(cleaned))) {
		cleaned = cleaned.replace(/٫/g, ".");
		cleaned = cleaned.replace(/(\d+),(\d+)/g, "$1.$2");
		const match = cleaned.match(/(\d+(?:\.\d+)?)/);
		if (!match) return 0;
		const val = parseFloat(match[1]);
		for (const [re, mult] of MULTIPLIERS) if (re.test(cleaned)) return Math.round(val * mult);
		return Math.round(val);
	} else {
		const rawDigits = cleaned.replace(/[^\d]/g, "");
		return rawDigits ? parseInt(rawDigits, 10) : 0;
	}
}
var thumbFor = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
function fromVideoRenderer(r) {
	const id = r?.videoId;
	const title = text(r?.title);
	if (!id || !title) return null;
	const byline = r.longBylineText ?? r.ownerText ?? r.shortBylineText;
	const channelId = collect(byline, "browseEndpoint")[0]?.browseId ?? collect(r, "browseEndpoint")[0]?.browseId ?? "";
	const thumbs = r.thumbnail?.thumbnails ?? [];
	const thumbnail = thumbs.length > 0 ? thumbs.at(-1)?.url || thumbFor(id) : thumbFor(id);
	const badgesStr = JSON.stringify(r.badges ?? []);
	const overlaysStr = JSON.stringify(r.thumbnailOverlays ?? []);
	const viewStr = text(r.viewCountText);
	const timeStr = text(r.publishedTimeText);
	const durSec = parseDuration(text(r.lengthText));
	const isLive = badgesStr.includes("LIVE") || badgesStr.includes("مباشر") || badgesStr.includes("BADGE_STYLE_TYPE_LIVE_NOW") || overlaysStr.includes("\"style\":\"LIVE\"") || /watching|مشاهدة حالياً|يشاهد الآن/i.test(viewStr) || /بث مباشر|\blive stream\b/i.test(title);
	const isShort = !isLive && (overlaysStr.includes("\"style\":\"SHORTS\"") || /#shorts\b|#short\b/i.test(title) || durSec > 0 && durSec <= 60 && !timeStr.includes("مباشر") && !timeStr.toLowerCase().includes("live"));
	return {
		url: `/watch?v=${id}`,
		type: isLive ? "live" : isShort ? "shorts" : "stream",
		isLive,
		isShort,
		title,
		thumbnail,
		uploaderName: text(byline) || "YouTube",
		uploaderUrl: channelId ? `/channel/${channelId}` : void 0,
		uploaderAvatar: collect(r, "channelThumbnailSupportedRenderers")[0] ? collect(r, "thumbnails")[1]?.[0]?.url : void 0,
		uploaderVerified: JSON.stringify(r.ownerBadges ?? []).includes("VERIFIED"),
		uploadedDate: isLive ? "مباشر" : timeStr,
		duration: isLive ? 0 : durSec,
		views: parseCount(viewStr),
		description: text(r.detailedMetadataSnippets?.[0]?.snippetText)
	};
}
/** Newer "lockup" cards (related videos, channel grids). */
function fromLockup(r) {
	const id = r?.contentId;
	const meta = r?.metadata?.lockupMetadataViewModel;
	const title = text(meta?.title);
	if (!id || !title || r?.contentType !== "LOCKUP_CONTENT_TYPE_VIDEO") return null;
	const rows = collect(meta?.metadata, "metadataRows")[0] ?? [];
	const parts = (i) => rows[i]?.metadataParts ?? [];
	let channelName = "";
	let views = 0;
	let uploadedDate = "";
	if (rows.length >= 2) {
		channelName = text(parts(0)[0]?.text);
		views = parseCount(text(parts(1)[0]?.text));
		uploadedDate = text(parts(1)[1]?.text);
	} else if (rows.length === 1) {
		const row0 = parts(0);
		views = parseCount(text(row0[0]?.text));
		uploadedDate = text(row0[1]?.text);
	}
	const badgeText = (collect(r.contentImage, "thumbnailBadgeViewModel")[0]?.text ?? "").trim();
	const contentImageStr = JSON.stringify(r.contentImage ?? "");
	const isLive = /LIVE|مباشر|بث مباشر/i.test(badgeText) || contentImageStr.includes("\"style\":\"LIVE\"") || /بث مباشر|\blive stream\b/i.test(title);
	const durSec = isLive ? 0 : parseDuration(badgeText);
	const isShort = !isLive && (r.contentType === "LOCKUP_CONTENT_TYPE_SHORTS" || /#shorts\b|#short\b/i.test(title) || durSec > 0 && durSec <= 60);
	const channelId = collect(meta?.image, "browseEndpoint")[0]?.browseId ?? "";
	return {
		url: `/watch?v=${id}`,
		type: isLive ? "live" : isShort ? "shorts" : "stream",
		isLive,
		isShort,
		title,
		thumbnail: collect(r.contentImage, "sources")[0]?.at(-1)?.url ?? thumbFor(id),
		uploaderName: channelName,
		uploaderUrl: channelId ? `/channel/${channelId}` : void 0,
		uploaderAvatar: collect(meta?.image, "sources")[0]?.[0]?.url,
		uploadedDate: isLive ? "مباشر" : uploadedDate,
		duration: isLive ? 0 : durSec,
		views
	};
}
var https = (u) => u ? u.startsWith("//") ? `https:${u}` : u : "";
function fromChannelRenderer(r) {
	const id = r?.channelId;
	const name = text(r?.title);
	if (!id || !name) return null;
	const subsLabel = [text(r.videoCountText), text(r.subscriberCountText)].find((s) => /مشترك|subscrib/i.test(s));
	return {
		id,
		name,
		avatar: https(r?.thumbnail?.thumbnails?.at(-1)?.url),
		subscribers: parseCount(subsLabel ?? text(r.subscriberCountText)),
		description: text(r.descriptionSnippet),
		verified: JSON.stringify(r.ownerBadges ?? []).includes("VERIFIED")
	};
}
function fromPlaylistRenderer(r) {
	const id = r?.playlistId;
	const title = text(r?.title);
	if (!id || !title) return null;
	const firstVideoId = collect(r, "videoId")[0];
	return {
		id,
		title,
		thumbnail: https(collect(r, "thumbnails")[0]?.at?.(-1)?.url) || (firstVideoId ? thumbFor(firstVideoId) : ""),
		videoCount: parseCount(String(r.videoCount ?? text(r.videoCountText) ?? "")),
		uploaderName: text(r.longBylineText ?? r.shortBylineText),
		firstVideoId
	};
}
/** Newer playlist "lockup" cards. */
function fromPlaylistLockup(r) {
	const id = r?.contentId;
	const meta = r?.metadata?.lockupMetadataViewModel;
	const title = text(meta?.title);
	if (!id || !title || r?.contentType !== "LOCKUP_CONTENT_TYPE_PLAYLIST") return null;
	const rows = collect(meta?.metadata, "metadataRows")[0] ?? [];
	const badge = collect(r.contentImage, "thumbnailOverlayBadgeViewModel")[0];
	return {
		id,
		title,
		thumbnail: https(collect(r.contentImage, "sources")[0]?.at(-1)?.url),
		videoCount: parseCount(text(collect(badge, "text")[0]) || ""),
		uploaderName: text(rows[0]?.metadataParts?.[0]?.text)
	};
}
/** Channel cards inside any search response. */
function extractChannels(payload) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
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
function extractPlaylists(payload) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (p) => {
		if (!p || seen.has(p.id) || !p.thumbnail) return;
		seen.add(p.id);
		out.push(p);
	};
	for (const r of collect(payload, "playlistRenderer")) push(fromPlaylistRenderer(r));
	for (const r of collect(payload, "gridPlaylistRenderer")) push(fromPlaylistRenderer(r));
	for (const r of collect(payload, "lockupViewModel")) push(fromPlaylistLockup(r));
	return out;
}
function fromReelItem(r) {
	const id = r?.videoId;
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
		views: parseCount(text(r.viewCountText))
	};
}
function fromShortsLockup(s) {
	if (!s) return null;
	const videoId = s.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId || s.entityId?.replace("shorts-shelf-item-", "") || "";
	if (!videoId) return null;
	const title = text(s.overlayMetadata?.primaryText?.content) || "Shorts";
	const views = parseCount(text(s.overlayMetadata?.secondaryText?.content));
	const thumb = s.thumbnail?.sources?.at(-1)?.url || s.onTap?.innertubeCommand?.reelWatchEndpoint?.thumbnail?.thumbnails?.at(-1)?.url || thumbFor(videoId);
	return {
		url: `/watch?v=${videoId}`,
		type: "shorts",
		isShort: true,
		isLive: false,
		title,
		thumbnail: thumb,
		uploaderName: "Shorts",
		duration: 30,
		views
	};
}
/** Pull every playable video card out of any InnerTube response. */
function extractVideos(payload) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (v) => {
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
/** filter=videos */
var SEARCH_VIDEOS = "EgIQAQ%3D%3D";
/** filter=videos + sort by view count + uploaded this week */
var SEARCH_HOT = "CAMSBQgDEAE%3D";
function continuationToken(payload) {
	const items = collect(payload, "continuationItemRenderer");
	for (const item of items) {
		const token = item?.continuationEndpoint?.continuationCommand?.token ?? item?.continuationCommand?.token;
		if (typeof token === "string" && token.length > 10) return token;
	}
	const tokens = collect(payload, "continuationCommand").map((c) => c?.token).filter((t) => typeof t === "string" && t.length > 10);
	if (tokens.length) return tokens.at(-1) ?? null;
	const legacy = collect(payload, "nextContinuationData");
	if (legacy.length) return legacy[0]?.continuation ?? null;
	return null;
}
async function search(query, params = SEARCH_VIDEOS) {
	return cached(`search:${JSON.stringify([query, params])}`, 6e5, async () => {
		return (await searchPage(query, params)).items;
	});
}
/**
* One page of search results; pass `continuation` to get the next page.
* With no `params` the results are mixed (videos + channels + playlists),
* exactly like youtube.com.
*/
async function searchPage(query, params = "", continuation) {
	return cached(`searchPage:${JSON.stringify([
		query,
		params,
		continuation ?? null
	])}`, 6e5, async () => {
		const data = await innertube("search", continuation ? { continuation } : {
			query,
			...params ? { params } : {}
		});
		return {
			items: extractVideos(data),
			continuation: continuationToken(data),
			channels: extractChannels(data),
			playlists: extractPlaylists(data)
		};
	});
}
/** All videos of a playlist. */
async function playlist(id) {
	return cached(`playlist:${id}`, 18e5, async () => {
		const browseId = id.startsWith("VL") ? id : `VL${id}`;
		const data = await innertube("browse", { browseId });
		const header = collect(data, "playlistHeaderRenderer")[0] ?? collect(data, "pageHeaderViewModel")[0] ?? {};
		const meta = collect(data, "microformatDataRenderer")[0] ?? {};
		const videos = extractVideos(data);
		const title = text(header.title) || text(collect(header, "dynamicTextViewModel")[0]?.text) || meta.title || "قائمة تشغيل";
		return {
			id: browseId.replace(/^VL/, ""),
			title,
			thumbnail: https(collect(header, "thumbnails")[0]?.at?.(-1)?.url) || videos[0]?.thumbnail || "",
			videoCount: parseCount(text(header.numVideosText)) || videos.length,
			uploaderName: text(header.ownerText) || text(collect(header, "ownerText")[0]),
			description: meta.description ?? text(header.descriptionText),
			videos
		};
	});
}
var TRENDING_QUERIES = [
	"مصر",
	"الأكثر مشاهدة",
	"trailer",
	"music"
];
function interleave(lists) {
	const merged = [];
	const seen = /* @__PURE__ */ new Set();
	const depth = Math.max(0, ...lists.map((l) => l.length));
	for (let i = 0; i < depth; i++) for (const list of lists) {
		const v = list[i];
		if (!v || seen.has(v.url)) continue;
		seen.add(v.url);
		merged.push(v);
	}
	return merged;
}
/**
* YouTube retired the public "trending" browse feed for anonymous clients, so
* the hot list is rebuilt from most-viewed uploads of the last week.
* `cursors` (from a previous page) fetches the next page of every source.
*/
async function trendingPage(cursors) {
	return cached(`trendingPage:${JSON.stringify(cursors ?? null)}`, 6e5, async () => {
		const pages = (await Promise.allSettled(TRENDING_QUERIES.map((q, i) => {
			if (cursors) {
				const c = cursors[i];
				return c ? searchPage(q, SEARCH_HOT, c) : Promise.resolve({
					items: [],
					continuation: null,
					channels: [],
					playlists: []
				});
			}
			return searchPage(q, SEARCH_HOT);
		}))).map((b) => b.status === "fulfilled" ? b.value : {
			items: [],
			continuation: null,
			channels: [],
			playlists: []
		});
		const items = interleave(pages.map((p) => p.items));
		if (!items.length && !cursors) throw new Error("trending unavailable");
		return {
			items,
			cursors: pages.map((p) => p.continuation)
		};
	});
}
async function trending() {
	return cached("trending", 6e5, async () => {
		return (await trendingPage()).items;
	});
}
async function suggest(query) {
	return cached(`suggest:${query}`, 36e5, async () => {
		const res = await fetch(`https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&hl=ar&gl=eg&oe=utf-8&q=${encodeURIComponent(query)}`);
		if (!res.ok) return [];
		const body = await res.text();
		const json = body.slice(body.indexOf("(") + 1, body.lastIndexOf(")"));
		try {
			return (JSON.parse(json)[1] || []).map((row) => row[0]).slice(0, 10);
		} catch {
			return [];
		}
	});
}
function parseCommentEntities(data) {
	const fromEntities = collect(data, "commentEntityPayload").map((c) => ({
		author: c?.author?.displayName ?? "",
		thumbnail: c?.author?.avatarThumbnailUrl ?? "",
		commentText: c?.properties?.content?.content ?? "",
		commentedTime: c?.properties?.publishedTime ?? "",
		likeCount: parseCount(c?.toolbar?.likeCountLiked ?? c?.toolbar?.likeCountNotliked ?? ""),
		replyCount: parseCount(c?.toolbar?.replyCount ?? "")
	})).filter((c) => c.commentText);
	if (fromEntities.length > 0) return fromEntities;
	return collect(data, "commentRenderer").map((c) => ({
		author: text(c?.authorText) || "",
		thumbnail: c?.authorThumbnail?.thumbnails?.at(-1)?.url || "",
		commentText: text(c?.contentText) || "",
		commentedTime: text(c?.publishedTimeText) || "",
		likeCount: parseCount(text(c?.voteCount) || ""),
		replyCount: parseCount(text(c?.replyCount) || "")
	})).filter((c) => c.commentText);
}
function extractCommentsTotalCount(data) {
	const header = collect(data, "commentsHeaderRenderer")[0];
	if (header) {
		const count = parseCount(text(header?.countText) || text(header?.commentsCount));
		if (count > 0) return count;
	}
	try {
		const str = JSON.stringify(data);
		const m = str.match(/"countText":\{"runs":\[\{"text":"([^"]+)"\}/) || str.match(/"commentsCount":\{"runs":\[\{"text":"([^"]+)"\}/);
		if (m && m[1]) {
			const c = parseCount(m[1]);
			if (c > 0) return c;
		}
	} catch {}
	return 0;
}
function isNextCommentsToken(rawToken) {
	if (!rawToken || typeof rawToken !== "string" || rawToken.length < 10) return false;
	try {
		const decoded = decodeURIComponent(rawToken);
		if (decoded.includes("comment-replies") || decoded.includes("replies-item")) return false;
		const bufStr = Buffer.from(decoded, "base64").toString("latin1");
		if (bufStr.includes("comment-replies") || bufStr.includes("replies_stream")) return false;
		if (bufStr.includes("get_ranked_streams") || bufStr.includes("comments-section") || bufStr.includes("engagement-panel-comments-section") || bufStr.includes("comments")) return true;
	} catch {}
	return false;
}
function findNextCommentsToken(data) {
	const items = collect(data, "continuationItemRenderer");
	for (let i = items.length - 1; i >= 0; i--) {
		const item = items[i];
		const token = item?.continuationEndpoint?.continuationCommand?.token || item?.continuationCommand?.token;
		if (isNextCommentsToken(token)) return token;
	}
	const commands = collect(data, "continuationCommand");
	for (let i = commands.length - 1; i >= 0; i--) {
		const token = commands[i]?.token;
		if (isNextCommentsToken(token)) return token;
	}
}
async function fetchComments(token, targetCount = 40) {
	try {
		const items = [];
		let curToken = token;
		let totalCount = 0;
		let iterations = 0;
		while (curToken && items.length < targetCount && iterations < 4) {
			iterations++;
			const p = await innertube("next", { continuation: curToken });
			if (!totalCount) totalCount = extractCommentsTotalCount(p);
			const pageItems = parseCommentEntities(p);
			if (!pageItems.length) {
				const next = findNextCommentsToken(p);
				if (!next || next === curToken) break;
				curToken = next;
				continue;
			}
			items.push(...pageItems);
			const nextToken = findNextCommentsToken(p);
			if (!nextToken || nextToken === curToken) {
				curToken = void 0;
				break;
			}
			curToken = nextToken;
		}
		return {
			items,
			totalCount,
			nextContinuation: curToken
		};
	} catch {
		return {
			items: [],
			totalCount: 0
		};
	}
}
/** Everything the watch page needs. Playback itself uses the YouTube player. */
async function videoDetails(videoId) {
	return cached(`videoDetails:${videoId}`, 36e5, async () => {
		const next = await innertube("next", { videoId });
		const primary = collect(next, "videoPrimaryInfoRenderer")[0] ?? {};
		const secondary = collect(next, "videoSecondaryInfoRenderer")[0] ?? {};
		const owner = collect(secondary, "videoOwnerRenderer")[0] ?? {};
		const title = text(primary.title);
		if (!title) throw new Error("video unavailable");
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
		if (!likes) {
			const allButtons = collect(next, "buttonViewModel");
			for (const b of allButtons) if (b.accessibilityId === "id.video.like.button" || /like/i.test(b.accessibilityId ?? "")) {
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
		if (!likes) {
			const legacyButtons = collect(primary, "likeButton");
			for (const lb of legacyButtons) {
				const v = parseCount(text(lb?.toggleButtonRenderer?.defaultText) ?? text(lb?.toggleButtonRenderer?.accessibility?.label) ?? "");
				if (v > 0) {
					likes = v;
					break;
				}
			}
		}
		const rawRelDate = text(primary.relativeDateText?.accessibility?.accessibilityData?.label) || text(primary.relativeDateText);
		const rawDateText = text(collect(primary, "dateText")[0]) || text(primary.dateText);
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
		const allTokens = collect(next, "continuationItemRenderer").map((c) => c?.continuationEndpoint?.continuationCommand?.token).filter(Boolean);
		const commentToken = allTokens.find((t) => {
			try {
				return decodeURIComponent(t).includes("comments-section");
			} catch {
				return false;
			}
		}) || allTokens[0];
		const commentsData = commentToken ? await fetchComments(commentToken, 30) : {
			items: [],
			totalCount: 0
		};
		const category = text(collect(next, "playerMicroformatRenderer")[0]?.category) || text(collect(next, "microformatDataRenderer")[0]?.category) || "";
		return {
			title,
			description: text(collect(secondary, "attributedDescription")[0]) || text(secondary.description),
			uploadDate,
			relativeDate,
			category,
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
			commentsContinuation: commentsData.nextContinuation
		};
	});
}
async function getCommentsPage(token) {
	const res = await fetchComments(token, 40);
	return {
		items: res.items,
		nextContinuation: res.nextContinuation
	};
}
/** Videos tab of a channel (accepts UC… id or @handle). */
async function channel(input) {
	return cached(`channel:${input.trim()}`, 18e5, async () => {
		const raw = input.trim();
		let browseId = raw.startsWith("UC") ? raw : "";
		if (!browseId) {
			const found = await innertube("search", {
				query: raw.replace(/^\/?(c\/|user\/|channel\/)?@?/, ""),
				params: "EgIQAg%3D%3D"
			});
			browseId = collect(found, "channelRenderer")[0]?.channelId ?? collect(found, "browseEndpoint").find((b) => b?.browseId?.startsWith("UC"))?.browseId ?? "";
			if (!browseId) throw new Error("channel not found");
		}
		const [homeResult, vidsResult, shortsResult] = await Promise.allSettled([
			innertube("browse", { browseId }),
			innertube("browse", {
				browseId,
				params: "EgZ2aWRlb3PyBgQKAjoA"
			}),
			innertube("browse", {
				browseId,
				params: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D"
			})
		]);
		const homeData = homeResult.status === "fulfilled" ? homeResult.value : {};
		const data = vidsResult.status === "fulfilled" ? vidsResult.value : {};
		const shortsData = shortsResult.status === "fulfilled" ? shortsResult.value : {};
		const header = collect(homeData, "c4TabbedHeaderRenderer")[0] ?? collect(homeData, "pageHeaderViewModel")[0] ?? collect(data, "c4TabbedHeaderRenderer")[0] ?? collect(data, "pageHeaderViewModel")[0] ?? {};
		const meta = collect(homeData, "microformatDataRenderer")[0] ?? collect(data, "microformatDataRenderer")[0] ?? {};
		const name = text(header.title) || text(collect(header, "dynamicTextViewModel")[0]?.text) || meta.title || "";
		const avatar = header?.avatar?.thumbnails?.at(-1)?.url ?? collect(header, "avatarViewModel")[0]?.image?.sources?.at(-1)?.url ?? meta.thumbnail?.thumbnails?.at(-1)?.url ?? "";
		const banner = header?.banner?.thumbnails?.at(-1)?.url ?? collect(header, "banner")[0]?.imageBannerViewModel?.image?.sources?.at(-1)?.url;
		const metaParts = collect(header, "metadataParts").flat();
		const subsPart = metaParts.find((p) => /مشترك|subscri/i.test(text(p?.text) || text(p?.accessibilityLabel)));
		const vidsPart = metaParts.find((p) => /فيديو|video/i.test(text(p?.text) || text(p?.accessibilityLabel)));
		const subscriberText = text(subsPart?.text) || text(subsPart?.accessibilityLabel) || text(header.subscriberCountText) || "";
		const videoCountText = text(vidsPart?.text) || text(vidsPart?.accessibilityLabel) || text(header.videosCountText) || text(header.videoCountText) || "";
		const subscriberCount = parseCount(subscriberText);
		const videoCount = parseCount(videoCountText);
		const rawVideos = extractVideos(data);
		const homeVideos = extractVideos(homeData).filter((v) => !v.isShort);
		const videos = (rawVideos.length > 0 ? rawVideos : homeVideos).map((v) => ({
			...v,
			uploaderName: v.uploaderName || name,
			uploaderAvatar: v.uploaderAvatar || avatar,
			uploaderUrl: v.uploaderUrl || `/channel/${browseId}`
		}));
		const shorts = extractVideos(shortsData).map((s) => ({
			...s,
			uploaderName: name,
			uploaderAvatar: avatar,
			uploaderUrl: `/channel/${browseId}`
		}));
		return {
			id: browseId,
			name,
			avatarUrl: avatar,
			bannerUrl: banner,
			subscriberCount: subscriberCount || void 0,
			subscriberText: subscriberText || void 0,
			videoCount: videoCount || void 0,
			videoCountText: videoCountText || void 0,
			description: meta.description ?? "",
			verified: JSON.stringify(header.badges ?? []).includes("VERIFIED"),
			relatedStreams: videos,
			shorts,
			nextVideos: continuationToken(rawVideos.length > 0 ? data : homeData),
			nextShorts: continuationToken(shortsData)
		};
	});
}
function decodeXml(s) {
	return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code))).trim();
}
/** Lightweight RSS feed for channel videos. Falls back to channel() on failure or 0 items. */
async function channelFeed(channelId) {
	const raw = channelId.trim();
	return cached(`channelfeed:${raw}`, 9e5, async () => {
		let cleanId = raw.startsWith("UC") ? raw : "";
		if (!cleanId) cleanId = raw.replace(/^\/?(c\/|user\/|channel\/)?@?/, "");
		const fallbackToChannel = async () => {
			return (await channel(raw)).relatedStreams || [];
		};
		try {
			const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(cleanId)}`;
			const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" } });
			if (!res.ok) return await fallbackToChannel();
			const xml = await res.text();
			const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi);
			if (!entries || entries.length === 0) return await fallbackToChannel();
			const feedAuthorMatch = xml.match(/<feed[\s\S]*?<author>[\s\S]*?<name>([\s\S]*?)<\/name>/i);
			const feedAuthorName = feedAuthorMatch ? decodeXml(feedAuthorMatch[1]) : "";
			const feedChannelIdMatch = xml.match(/<yt:channelId>([^<]+)<\/yt:channelId>/i);
			const resolvedChannelId = feedChannelIdMatch ? feedChannelIdMatch[1].trim() : cleanId;
			const videos = [];
			for (const entry of entries) {
				const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/i);
				const videoId = idMatch ? idMatch[1].trim() : "";
				if (!videoId) continue;
				const titleMatch = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
				const title = titleMatch ? decodeXml(titleMatch[1]) : "";
				const pubMatch = entry.match(/<published>([^<]+)<\/published>/i);
				const pubStr = pubMatch ? pubMatch[1].trim() : "";
				const uploaded = pubStr ? new Date(pubStr).getTime() : Date.now();
				const authorMatch = entry.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/i);
				const uploaderName = authorMatch ? decodeXml(authorMatch[1]) : feedAuthorName;
				const viewsMatch = entry.match(/<media:statistics[^>]+views="(\d+)"/i) || entry.match(/views="(\d+)"/i);
				const views = viewsMatch ? parseInt(viewsMatch[1], 10) : void 0;
				const linkMatch = entry.match(/<link[^>]+href="([^"]+)"/i);
				const isShort = (linkMatch ? linkMatch[1] : "").includes("/shorts/") || /\/shorts\//i.test(entry);
				videos.push({
					url: `/watch?v=${videoId}`,
					title,
					thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
					uploaderName,
					uploaderUrl: `/channel/${resolvedChannelId}`,
					uploaded: Number.isNaN(uploaded) ? Date.now() : uploaded,
					duration: 0,
					views,
					isShort
				});
			}
			if (videos.length === 0) return await fallbackToChannel();
			return videos;
		} catch {
			return await fallbackToChannel();
		}
	});
}
/** Fetch a generic continuation page (works for channel tabs, playlists, etc). */
async function browsePage(continuation) {
	const data = await innertube("browse", { continuation });
	return {
		items: extractVideos(data),
		continuation: continuationToken(data),
		channels: [],
		playlists: []
	};
}
//#endregion
export { browsePage, channel, channelFeed, getCommentsPage, playlist, search, searchPage, suggest, trending, trendingPage, videoDetails };
