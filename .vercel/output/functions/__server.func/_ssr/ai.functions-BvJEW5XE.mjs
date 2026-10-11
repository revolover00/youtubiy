import { l as createServerFn } from "./createServerFn-yTfeHp1H.mjs";
import { t as createServerRpc } from "./createServerRpc-D228ng_7.mjs";
import { a as objectType, i as numberType, o as stringType, r as arrayType } from "../_libs/tanstack__zod-adapter+zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-BvJEW5XE.js
var MODEL = "gemini-2.5-flash";
var candidateSchema = objectType({
	id: stringType(),
	title: stringType(),
	channel: stringType().optional().default(""),
	views: numberType().optional().default(0),
	ageDays: numberType().optional().default(0)
});
async function getClient() {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) throw new Error("GEMINI_API_KEY غير مضبوط على السيرفر");
	const { GoogleGenAI } = await import("../_libs/@google/genai.mjs").then((n) => n.t);
	return new GoogleGenAI({ apiKey });
}
var aiRerankFn_createServerFn_handler = createServerRpc({
	id: "c9755b0ba7ae84fedf1201a6643d79941fd9b5d6cdd28f9021338065c7ce159b",
	name: "aiRerankFn",
	filename: "src/lib/ai.functions.ts"
}, (opts) => aiRerankFn.__executeServer(opts));
var aiRerankFn = createServerFn({ method: "POST" }).validator((data) => objectType({
	summary: stringType().max(2e3),
	userPrompt: stringType().max(1e3).optional(),
	candidates: arrayType(candidateSchema).max(80)
}).parse(data)).handler(aiRerankFn_createServerFn_handler, async ({ data }) => {
	const ai = await getClient();
	const list = data.candidates.map((c, i) => `${i}|${c.id}|${c.title}|${c.channel}`).join("\n");
	const prompt = [
		"أنت محرّك ترشيح فيديوهات. قيّم كل فيديو حسب احتمال أن يشاهده هذا المستخدم حتى النهاية.",
		"",
		`ملف اهتمامات المستخدم: ${data.summary}`,
		data.userPrompt ? `توجيه صريح من المستخدم (له الأولوية القصوى): ${data.userPrompt}` : "",
		"",
		"المرشحون (index|id|العنوان|القناة):",
		list,
		"",
		"قواعد:",
		"- أعطِ درجة من 0 إلى 100 لكل فيديو.",
		"- الكليك بيت والعناوين المضللة: اخفض الدرجة.",
		"- لو المستخدم استبعد موضوعاً، أعطِ 0 لأي فيديو يخصه.",
		"- نوّع: لا تعطِ أعلى الدرجات كلها لنفس الموضوع.",
		"أعد JSON فقط بالشكل: {\"scores\":{\"<id>\":<0-100>},\"reason\":\"سطر واحد\"}"
	].filter(Boolean).join("\n");
	const raw = ((await ai.models.generateContent({
		model: MODEL,
		contents: prompt,
		config: {
			responseMimeType: "application/json",
			temperature: .3,
			maxOutputTokens: 4096
		}
	})).text ?? "").replace(/```json|```/g, "").trim();
	const parsed = JSON.parse(raw);
	const scores = {};
	for (const [id, v] of Object.entries(parsed.scores || {})) {
		const n = Number(v);
		if (Number.isFinite(n)) scores[id] = Math.max(0, Math.min(100, n)) / 100;
	}
	return {
		scores,
		reason: parsed.reason
	};
});
var aiTuneFn_createServerFn_handler = createServerRpc({
	id: "69e1a95792478bc6fde948266d0d4d0e0d3d946e7caf22f789f7bdf208af433a",
	name: "aiTuneFn",
	filename: "src/lib/ai.functions.ts"
}, (opts) => aiTuneFn.__executeServer(opts));
var aiTuneFn = createServerFn({ method: "POST" }).validator((data) => objectType({
	userPrompt: stringType().min(2).max(1e3),
	language: stringType().default("ar"),
	topInterests: arrayType(stringType()).max(20).default([])
}).parse(data)).handler(aiTuneFn_createServerFn_handler, async ({ data }) => {
	const ai = await getClient();
	const prompt = [
		"حوّل طلب المستخدم إلى إعدادات خوارزمية ترشيح.",
		`طلب المستخدم: ${data.userPrompt}`,
		`اهتماماته المستنتجة حالياً: ${data.topInterests.join("، ") || "لا يوجد"}`,
		`لغة الواجهة: ${data.language}`,
		"",
		"أعد JSON فقط:",
		`{
  "summary": "وصف سطر واحد للتوجّه الجديد",
  "includeTopics": ["كلمات بحث دقيقة للمواضيع المطلوبة، 3-8 عناصر"],
  "excludeTopics": ["كلمات للمواضيع المرفوضة"],
  "weights": { "channel": 0-1, "topic": 0-1, "freshness": 0-1, "quality": 0-1 },
  "minDurationSec": رقم أو null,
  "maxDurationSec": رقم أو null
}`,
		"مجموع weights يجب أن يساوي 1 تقريباً."
	].join("\n");
	const raw = ((await ai.models.generateContent({
		model: MODEL,
		contents: prompt,
		config: {
			responseMimeType: "application/json",
			temperature: .4
		}
	})).text ?? "").replace(/```json|```/g, "").trim();
	const parsed = JSON.parse(raw);
	return {
		summary: parsed.summary || data.userPrompt,
		includeTopics: parsed.includeTopics || [],
		excludeTopics: parsed.excludeTopics || [],
		weights: parsed.weights,
		minDurationSec: parsed.minDurationSec ?? null,
		maxDurationSec: parsed.maxDurationSec ?? null,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
});
//#endregion
export { aiRerankFn_createServerFn_handler, aiTuneFn_createServerFn_handler };
