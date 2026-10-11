import { l as createServerFn } from "./createServerFn-yTfeHp1H.mjs";
import { a as objectType, i as numberType, o as stringType, r as arrayType } from "../_libs/tanstack__zod-adapter+zod.mjs";
import { n as channelIdFromUrl, t as ageDays } from "./format-C7qBpJMP.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Dmfi4vHA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aiAlgorithm-BgK58VtT.js
var candidateSchema = objectType({
	id: stringType(),
	title: stringType(),
	channel: stringType().optional().default(""),
	views: numberType().optional().default(0),
	ageDays: numberType().optional().default(0)
});
var aiRerankFn = createServerFn({ method: "POST" }).validator((data) => objectType({
	summary: stringType().max(2e3),
	userPrompt: stringType().max(1e3).optional(),
	candidates: arrayType(candidateSchema).max(80)
}).parse(data)).handler(createSsrRpc("c9755b0ba7ae84fedf1201a6643d79941fd9b5d6cdd28f9021338065c7ce159b"));
createServerFn({ method: "POST" }).validator((data) => objectType({
	userPrompt: stringType().min(2).max(1e3),
	language: stringType().default("ar"),
	topInterests: arrayType(stringType()).max(20).default([])
}).parse(data)).handler(createSsrRpc("69e1a95792478bc6fde948266d0d4d0e0d3d946e7caf22f789f7bdf208af433a"));
var STORAGE_KEY = "yt_ai_algorithm_config";
var RERANK_CACHE = "yt_ai_rerank_cache";
var AI_BLEND = .4;
var RERANK_LIMIT = 80;
function getStoredAIConfig() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function cacheKey(ids, prompt) {
	let h = 0;
	const s = ids.slice(0, 40).join(",") + "|" + (prompt || "");
	for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
	return `${RERANK_CACHE}:${h}`;
}
function readCache(key) {
	try {
		const raw = sessionStorage.getItem(key);
		if (!raw) return null;
		const { at, scores } = JSON.parse(raw);
		if (Date.now() - at > 18e5) return null;
		return scores;
	} catch {
		return null;
	}
}
function writeCache(key, scores) {
	try {
		sessionStorage.setItem(key, JSON.stringify({
			at: Date.now(),
			scores
		}));
	} catch {}
}
async function aiRerank(params) {
	const { scored, pool, summary } = params;
	const stored = getStoredAIConfig();
	const userPrompt = params.userPrompt || (stored ? [
		stored.summary,
		stored.includeTopics?.length ? `ركّز على: ${stored.includeTopics.join("، ")}` : "",
		stored.excludeTopics?.length ? `استبعد: ${stored.excludeTopics.join("، ")}` : ""
	].filter(Boolean).join(". ") : void 0);
	const head = scored.slice(0, RERANK_LIMIT);
	const tail = scored.slice(RERANK_LIMIT);
	const key = cacheKey(head.map((h) => h.id), userPrompt);
	let scores = readCache(key);
	if (!scores) {
		scores = (await aiRerankFn({ data: {
			summary,
			userPrompt,
			candidates: head.map((h) => {
				const v = pool.get(h.id)?.video;
				return {
					id: h.id,
					title: h.title.slice(0, 140),
					channel: v?.uploaderName?.slice(0, 60) || channelIdFromUrl(v?.uploaderUrl || ""),
					views: v?.views || 0,
					ageDays: Math.round(ageDays(v?.uploaded, v?.uploadedDate))
				};
			})
		} })).scores;
		writeCache(key, scores);
	}
	const maxBase = Math.max(...head.map((h) => h.score), 1e-4);
	return [...head.map((h) => {
		const ai = scores?.[h.id];
		if (ai === void 0) return h;
		const mixed = h.score / maxBase * .6 + ai * AI_BLEND;
		return {
			...h,
			score: mixed * maxBase,
			parts: {
				...h.parts,
				ai
			},
			source: `${h.source}+ai`
		};
	}).sort((a, b) => b.score - a.score), ...tail];
}
//#endregion
export { aiRerank };
