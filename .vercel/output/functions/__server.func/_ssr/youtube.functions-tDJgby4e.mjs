import { l as createServerFn } from "./createServerFn-yTfeHp1H.mjs";
import { t as createServerRpc } from "./createServerRpc-D228ng_7.mjs";
import { a as objectType, o as stringType, r as arrayType } from "../_libs/tanstack__zod-adapter+zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/youtube.functions-tDJgby4e.js
var queryInput = (data) => objectType({ q: stringType().min(1) }).parse(data);
var searchVideosFn_createServerFn_handler = createServerRpc({
	id: "6c107fbeddfebecfade5757810a2c71586eab58b0aa58408eb40e323cba31003",
	name: "searchVideosFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => searchVideosFn.__executeServer(opts));
var searchVideosFn = createServerFn({ method: "POST" }).inputValidator(queryInput).handler(searchVideosFn_createServerFn_handler, async ({ data }) => {
	const { search } = await import("./youtube.server-C1fcFPOI.mjs");
	return search(data.q);
});
var searchPageFn_createServerFn_handler = createServerRpc({
	id: "d3e053beb9baef7858aa8ff1a9c0b9ff4c6ae59e8d67b8421f3e266406ed231a",
	name: "searchPageFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => searchPageFn.__executeServer(opts));
var searchPageFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	q: stringType().min(1),
	continuation: stringType().nullable().optional()
}).parse(data)).handler(searchPageFn_createServerFn_handler, async ({ data }) => {
	const { searchPage } = await import("./youtube.server-C1fcFPOI.mjs");
	return searchPage(data.q, void 0, data.continuation ?? null);
});
var suggestionsFn_createServerFn_handler = createServerRpc({
	id: "c179f018c7afafe2d17f332193a04e4ae0a6dc223c7e4b391482e17f731c50de",
	name: "suggestionsFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => suggestionsFn.__executeServer(opts));
var suggestionsFn = createServerFn({ method: "POST" }).inputValidator(queryInput).handler(suggestionsFn_createServerFn_handler, async ({ data }) => {
	const { suggest } = await import("./youtube.server-C1fcFPOI.mjs");
	return suggest(data.q);
});
var trendingFn_createServerFn_handler = createServerRpc({
	id: "a49e691b622c5fe29a55a052c2f795cd5b21b11101f470cdc26a4fb38d9c31f8",
	name: "trendingFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => trendingFn.__executeServer(opts));
var trendingFn = createServerFn({ method: "POST" }).handler(trendingFn_createServerFn_handler, async () => {
	const { trending } = await import("./youtube.server-C1fcFPOI.mjs");
	return trending();
});
var trendingPageFn_createServerFn_handler = createServerRpc({
	id: "81f6ffa4e0e71a805c26ed520123cfdb43e38ed55594fd0fe73a596c6ecd7607",
	name: "trendingPageFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => trendingPageFn.__executeServer(opts));
var trendingPageFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ cursors: arrayType(stringType().nullable()).optional() }).parse(data ?? {})).handler(trendingPageFn_createServerFn_handler, async ({ data }) => {
	const { trendingPage } = await import("./youtube.server-C1fcFPOI.mjs");
	return trendingPage(data.cursors);
});
var videoDetailsFn_createServerFn_handler = createServerRpc({
	id: "e58a257fcd97eda44ff2fb91258575a7acdae5d28eae84cb918f8133a8eb8d8e",
	name: "videoDetailsFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => videoDetailsFn.__executeServer(opts));
var videoDetailsFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ id: stringType().min(6) }).parse(data)).handler(videoDetailsFn_createServerFn_handler, async ({ data }) => {
	const { videoDetails } = await import("./youtube.server-C1fcFPOI.mjs");
	return videoDetails(data.id);
});
var playlistFn_createServerFn_handler = createServerRpc({
	id: "6ed3ca6507a5b00906856c4ba982ac97251ddfce084aa658a1c12d6d8b8aa5bc",
	name: "playlistFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => playlistFn.__executeServer(opts));
var playlistFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ id: stringType().min(2) }).parse(data)).handler(playlistFn_createServerFn_handler, async ({ data }) => {
	const { playlist } = await import("./youtube.server-C1fcFPOI.mjs");
	return playlist(data.id);
});
var channelFn_createServerFn_handler = createServerRpc({
	id: "7de321903635e9457261e7fd09127551080505b7a86bd3deb5bbb7a8b6f8c9c7",
	name: "channelFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => channelFn.__executeServer(opts));
var channelFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ id: stringType().min(1) }).parse(data)).handler(channelFn_createServerFn_handler, async ({ data }) => {
	const { channel } = await import("./youtube.server-C1fcFPOI.mjs");
	return channel(data.id);
});
var channelFeedFn_createServerFn_handler = createServerRpc({
	id: "d95940ea77e4afe8ab6f56da31d5c1c8d5dc6bc8bfa475fbbd764e56630f7cc9",
	name: "channelFeedFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => channelFeedFn.__executeServer(opts));
var channelFeedFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ id: stringType().min(1) }).parse(data)).handler(channelFeedFn_createServerFn_handler, async ({ data }) => {
	const { channelFeed } = await import("./youtube.server-C1fcFPOI.mjs");
	return channelFeed(data.id);
});
var browsePageFn_createServerFn_handler = createServerRpc({
	id: "5b0b18d8b92aa7dae9f22a3451e9df74637d6be54115a44f4b7f3156d077d1d9",
	name: "browsePageFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => browsePageFn.__executeServer(opts));
var browsePageFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ continuation: stringType().min(1) }).parse(data)).handler(browsePageFn_createServerFn_handler, async ({ data }) => {
	const { browsePage } = await import("./youtube.server-C1fcFPOI.mjs");
	return browsePage(data.continuation);
});
var commentsPageFn_createServerFn_handler = createServerRpc({
	id: "6ea08d0d84b44bcea33a8849ef5f29f447e191f3cfa5f45718053b4853f67a62",
	name: "commentsPageFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => commentsPageFn.__executeServer(opts));
var commentsPageFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ token: stringType().min(1) }).parse(data)).handler(commentsPageFn_createServerFn_handler, async ({ data }) => {
	const { getCommentsPage } = await import("./youtube.server-C1fcFPOI.mjs");
	return getCommentsPage(data.token);
});
var homeCandidatesFn_createServerFn_handler = createServerRpc({
	id: "082f69d107aea7952728f6125376cb9f1571a57f603de01dfdbce54d2d68c0aa",
	name: "homeCandidatesFn",
	filename: "src/lib/youtube.functions.ts"
}, (opts) => homeCandidatesFn.__executeServer(opts));
var homeCandidatesFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	channelIds: arrayType(stringType()),
	seedVideoIds: arrayType(stringType()),
	queries: arrayType(stringType())
}).parse(data ?? {})).handler(homeCandidatesFn_createServerFn_handler, async ({ data }) => {
	const { channelFeed, videoDetails, searchPage, trendingPage } = await import("./youtube.server-C1fcFPOI.mjs");
	const { videoIdFromUrl } = await import("./format-C7qBpJMP.mjs").then((n) => n.o);
	const startMs = Date.now();
	async function runInBatches(items, fn, limit = 6) {
		const results = new Array(items.length);
		let index = 0;
		async function worker() {
			while (index < items.length) {
				const i = index++;
				try {
					const res = await fn(items[i]);
					results[i] = {
						status: "fulfilled",
						value: res
					};
				} catch (reason) {
					results[i] = {
						status: "rejected",
						reason
					};
				}
			}
		}
		const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
		await Promise.all(workers);
		return results;
	}
	const tasks = [
		{ type: "trending" },
		...data.channelIds.map((id) => ({
			type: "channel",
			id
		})),
		...data.seedVideoIds.map((id) => ({
			type: "seed",
			id
		})),
		...data.queries.map((q) => ({
			type: "query",
			q
		}))
	];
	const taskResults = await runInBatches(tasks, async (task) => {
		if (task.type === "trending") return trendingPage();
		else if (task.type === "channel") return channelFeed(task.id);
		else if (task.type === "seed") return videoDetails(task.id);
		else return searchPage(task.q);
	}, 6);
	const subs = [];
	const related = [];
	const relatedIdsSet = /* @__PURE__ */ new Set();
	const interest = [];
	let trending = [];
	let trendingNext = null;
	const stats = {
		sub: {
			ok: 0,
			fail: 0
		},
		related: {
			ok: 0,
			fail: 0
		},
		interest: {
			ok: 0,
			fail: 0
		},
		trending: {
			ok: 0,
			fail: 0
		}
	};
	const rawErrors = [];
	tasks.forEach((task, idx) => {
		const res = taskResults[idx];
		const statKey = task.type === "trending" ? "trending" : task.type === "channel" ? "sub" : task.type === "seed" ? "related" : "interest";
		if (res.status !== "fulfilled") {
			stats[statKey].fail++;
			const reason = res.reason;
			const msg = (reason instanceof Error ? reason.message : typeof reason === "string" ? reason : JSON.stringify(reason) || "Error").slice(0, 120);
			rawErrors.push(msg);
			return;
		}
		stats[statKey].ok++;
		if (task.type === "trending") {
			const tp = res.value;
			trending = tp.items || [];
			trendingNext = tp.cursors || null;
		} else if (task.type === "channel") (res.value || []).slice(0, 8).forEach((v) => subs.push(v));
		else if (task.type === "seed") (res.value.relatedStreams || []).slice(0, 20).forEach((v) => {
			related.push(v);
			const vidId = videoIdFromUrl(v.url);
			if (vidId) relatedIdsSet.add(vidId);
		});
		else if (task.type === "query") (res.value.items || []).slice(0, 12).forEach((v) => interest.push(v));
	});
	return {
		subs,
		related,
		relatedIds: Array.from(relatedIdsSet),
		interest,
		trending,
		trendingNext,
		stats,
		errors: rawErrors.slice(0, 5),
		ms: Date.now() - startMs
	};
});
//#endregion
export { browsePageFn_createServerFn_handler, channelFeedFn_createServerFn_handler, channelFn_createServerFn_handler, commentsPageFn_createServerFn_handler, homeCandidatesFn_createServerFn_handler, playlistFn_createServerFn_handler, searchPageFn_createServerFn_handler, searchVideosFn_createServerFn_handler, suggestionsFn_createServerFn_handler, trendingFn_createServerFn_handler, trendingPageFn_createServerFn_handler, videoDetailsFn_createServerFn_handler };
