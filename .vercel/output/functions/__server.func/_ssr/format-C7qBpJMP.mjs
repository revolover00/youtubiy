//#region node_modules/.nitro/vite/services/ssr/assets/format-C7qBpJMP.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var format_exports = /* @__PURE__ */ __exportAll({
	ageDays: () => ageDays,
	channelIdFromUrl: () => channelIdFromUrl,
	cleanDateText: () => cleanDateText,
	fmtDuration: () => fmtDuration,
	fmtViews: () => fmtViews,
	getCurrentLang: () => getCurrentLang,
	isLiveStream: () => isLiveStream,
	isShortsVideo: () => isShortsVideo,
	isStandardVideo: () => isStandardVideo,
	parseChapters: () => parseChapters,
	seekTo: () => seekTo,
	timeAgo: () => timeAgo,
	videoIdFromUrl: () => videoIdFromUrl
});
function videoIdFromUrl(u) {
	if (!u) return "";
	const m = u.match(/[?&]v=([\w-]{6,})/);
	if (m) return m[1];
	const yb = u.match(/youtu\.be\/([\w-]{6,})/);
	if (yb) return yb[1];
	const w = u.match(/^\/watch\?v=([\w-]+)/);
	if (w) return w[1];
	return /^[\w-]{11}$/.test(u) ? u : "";
}
function channelIdFromUrl(u = "") {
	const m = u.match(/\/channel\/([\w-]+)/);
	return m ? m[1] : u;
}
function getCurrentLang() {
	if (typeof window !== "undefined") {
		const saved = localStorage.getItem("yt_lang");
		if (saved === "ar" || saved === "en") return saved;
	}
	return "en";
}
function fmtDuration(s) {
	if (s == null || s <= 0 || isNaN(s)) return "";
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const sec = Math.floor(s % 60);
	const mm = h ? String(m).padStart(2, "0") : String(m);
	return `${h ? h + ":" : ""}${mm}:${String(sec).padStart(2, "0")}`;
}
function isLiveStream(v) {
	if (!v) return false;
	if (v.isShort === true || v.type === "shorts" || v.uploaderName === "Shorts") return false;
	if (v.isLive === true || v.type === "live" || v.type === "live_stream") return true;
	const title = (v.title || "").toLowerCase();
	const date = (v.uploadedDate || "").toLowerCase();
	if (title.includes("#shorts") || title.includes("#short")) return false;
	const hasLiveKeywords = date.includes("مباشر") || date.includes("live") || date.includes("بدأ البث") || date.includes("started streaming") || date.includes("watching") || date.includes("مشاهدة حالياً") || date.includes("يشاهد الآن") || title.includes("بث مباشر") || title.includes("live stream") || title.includes("🔴") || /\b(stream|streaming) now\b/i.test(title) || /\[live\]|\(live\)/i.test(title);
	return (v.duration == null || v.duration === 0) && hasLiveKeywords;
}
function isShortsVideo(v) {
	if (!v) return false;
	if (isLiveStream(v)) return false;
	if (v.isShort === true || v.type === "shorts" || v.uploaderName === "Shorts") return true;
	const title = (v.title || "").toLowerCase();
	if (title.includes("#shorts") || title.includes("#short")) return true;
	if (v.url && (v.url.includes("/shorts/") || v.url.includes("shorts="))) return true;
	const dur = v.duration ?? 0;
	return dur > 0 && dur <= 60;
}
function isStandardVideo(v) {
	return !isLiveStream(v) && !isShortsVideo(v);
}
function fmtViews(n, lang = getCurrentLang()) {
	if (n == null || isNaN(n)) return "";
	return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", {
		notation: "compact",
		compactDisplay: "short",
		maximumFractionDigits: 1
	}).format(n);
}
var UNIT_DAYS = [
	[/(\d+)\s*sec/i, 1 / 86400],
	[/(\d+)\s*min/i, 1 / 1440],
	[/(\d+)\s*hour/i, 1 / 24],
	[/(\d+)\s*day/i, 1],
	[/(\d+)\s*week/i, 7],
	[/(\d+)\s*month/i, 30],
	[/(\d+)\s*year/i, 365],
	[/(?:قبل|منذ)?\s*(\d+)?\s*(?:ثانية|ثواني)/, 1 / 86400],
	[/(?:قبل|منذ)?\s*(\d+)?\s*(?:دقيقة|دقائق)/, 1 / 1440],
	[/(?:قبل|منذ)?\s*دقيقتين/, 2 / 1440],
	[/(?:قبل|منذ)?\s*ساعتين/, 2 / 24],
	[/(?:قبل|منذ)?\s*(\d+)?\s*(?:ساعة|ساعات)/, 1 / 24],
	[/(?:قبل|منذ)?\s*يومين/, 2],
	[/(?:قبل|منذ)?\s*(\d+)?\s*(?:يوم|أيام)/, 1],
	[/(?:قبل|منذ)?\s*أسبوعين/, 14],
	[/(?:قبل|منذ)?\s*(\d+)?\s*(?:أسبوع|أسابيع)/, 7],
	[/(?:قبل|منذ)?\s*شهرين/, 60],
	[/(?:قبل|منذ)?\s*(\d+)?\s*(?:شهر|أشهر)/, 30],
	[/(?:قبل|منذ)?\s*سنتين/, 730],
	[/(?:قبل|منذ)?\s*(\d+)?\s*(?:سنة|سنوات)/, 365]
];
var AR_MONTHS = {
	يناير: 0,
	فبراير: 1,
	مارس: 2,
	أبريل: 3,
	ابريل: 3,
	مايو: 4,
	يونيو: 5,
	يوليو: 6,
	أغسطس: 7,
	اغسطس: 7,
	سبتمبر: 8,
	أكتوبر: 9,
	اكتوبر: 9,
	نوفمبر: 10,
	ديسمبر: 11
};
function cleanDateText(s) {
	if (!s) return "";
	return s.replace(/[\u200e\u200f\u202a-\u202e]/g, "").replace(/\s+/g, " ").trim();
}
function ageDays(uploaded, uploadedDate) {
	if (uploaded && uploaded > 0) return Math.max(0, (Date.now() - uploaded) / 864e5);
	if (uploadedDate) {
		const norm = cleanDateText(uploadedDate).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
		const dmy = norm.match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
		if (dmy) {
			const [, d, m, y] = dmy;
			const dt = new Date(Number(y), Number(m) - 1, Number(d));
			if (!isNaN(dt.getTime())) return Math.max(0, (Date.now() - dt.getTime()) / 864e5);
		}
		const ymd = norm.match(/(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})/);
		if (ymd) {
			const [, y, m, d] = ymd;
			const dt = new Date(Number(y), Number(m) - 1, Number(d));
			if (!isNaN(dt.getTime())) return Math.max(0, (Date.now() - dt.getTime()) / 864e5);
		}
		const arMatch = norm.match(/(\d{1,2})\s+([^\s\d]+)\s+(\d{4})/);
		if (arMatch) {
			const [, d, monStr, y] = arMatch;
			const monthIdx = AR_MONTHS[monStr];
			if (monthIdx !== void 0) {
				const dt = new Date(Number(y), monthIdx, Number(d));
				if (!isNaN(dt.getTime())) return Math.max(0, (Date.now() - dt.getTime()) / 864e5);
			}
		}
		const parsedTs = Date.parse(norm);
		if (!isNaN(parsedTs)) return Math.max(0, (Date.now() - parsedTs) / 864e5);
		for (const [re, days] of UNIT_DAYS) {
			const m = norm.match(re);
			if (m) return ((m[1] ? Number(m[1]) : 1) || 1) * days;
		}
	}
	return 0;
}
var AR_UNITS = [
	[
		365,
		"سنة",
		"سنتين",
		"سنوات"
	],
	[
		30,
		"شهر",
		"شهرين",
		"أشهر"
	],
	[
		7,
		"أسبوع",
		"أسبوعين",
		"أسابيع"
	],
	[
		1,
		"يوم",
		"يومين",
		"أيام"
	],
	[
		1 / 24,
		"ساعة",
		"ساعتين",
		"ساعات"
	],
	[
		1 / 1440,
		"دقيقة",
		"دقيقتين",
		"دقائق"
	]
];
var EN_UNITS = [
	[
		365,
		"year",
		"years"
	],
	[
		30,
		"month",
		"months"
	],
	[
		7,
		"week",
		"weeks"
	],
	[
		1,
		"day",
		"days"
	],
	[
		1 / 24,
		"hour",
		"hours"
	],
	[
		1 / 1440,
		"minute",
		"minutes"
	]
];
function timeAgo(uploaded, uploadedDate, lang = getCurrentLang()) {
	if (uploadedDate) {
		const trimmed = cleanDateText(uploadedDate);
		if (lang === "ar" && (trimmed.startsWith("قبل ") || trimmed.startsWith("منذ ") || trimmed.startsWith("تم البث ") || trimmed.startsWith("تم إجراء بث مباشر "))) return trimmed;
		if (lang === "en" && (trimmed.endsWith(" ago") || trimmed.startsWith("Streamed "))) return trimmed;
	}
	const d = ageDays(uploaded, uploadedDate);
	if (d <= 0) {
		const clean = cleanDateText(uploadedDate);
		if (clean) return clean;
		return lang === "ar" ? "الآن" : "Just now";
	}
	if (d < 1 / 1440) return lang === "ar" ? "الآن" : "Just now";
	if (lang === "en") {
		for (const [unit, sing, plur] of EN_UNITS) {
			const v = Math.floor(d / unit);
			if (v >= 1) return `${v} ${v === 1 ? sing : plur} ago`;
		}
		return "Just now";
	}
	for (const [unit, one, two, few] of AR_UNITS) {
		const v = Math.floor(d / unit);
		if (v >= 1) {
			if (v === 1) return `قبل ${one}`;
			if (v === 2) return `قبل ${two}`;
			if (v <= 10) return `قبل ${v} ${few}`;
			return `قبل ${v} ${one}`;
		}
	}
	return "الآن";
}
function parseChapters(description) {
	if (!description) return [];
	const lines = description.split(/\r?\n/);
	const chapters = [];
	const timestampRegex = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})/;
	for (const rawLine of lines) {
		const line = rawLine.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).trim();
		if (!line) continue;
		const match = line.match(timestampRegex);
		if (!match) continue;
		const fullMatch = match[0];
		const h = match[1] ? parseInt(match[1], 10) : 0;
		const m = parseInt(match[2], 10);
		const s = parseInt(match[3], 10);
		if (m >= 60 || s >= 60) continue;
		const startSeconds = h * 3600 + m * 60 + s;
		let label = line.replace(fullMatch, "").replace(/^[\s\-–—:;.)\][]+/, "").replace(/[\s\-–—:;.)\][]+$/, "").trim();
		if (!label) label = `Chapter @ ${fullMatch}`;
		chapters.push({
			start: startSeconds,
			label
		});
	}
	if (chapters.length < 3) return [];
	if (chapters[0].start !== 0) return [];
	for (let i = 1; i < chapters.length; i++) if (chapters[i].start <= chapters[i - 1].start) return [];
	return chapters;
}
function seekTo(seconds) {
	if (typeof window === "undefined" || seconds < 0) return;
	const iframe = document.querySelector("#persistent-player iframe");
	if (iframe?.contentWindow) {
		iframe.contentWindow.postMessage(JSON.stringify({
			event: "command",
			func: "seekTo",
			args: [seconds, true]
		}), "*");
		iframe.contentWindow.postMessage(JSON.stringify({
			event: "command",
			func: "playVideo",
			args: []
		}), "*");
	}
}
//#endregion
export { fmtViews as a, isShortsVideo as c, seekTo as d, timeAgo as f, fmtDuration as i, isStandardVideo as l, channelIdFromUrl as n, format_exports as o, videoIdFromUrl as p, cleanDateText as r, isLiveStream as s, ageDays as t, parseChapters as u };
