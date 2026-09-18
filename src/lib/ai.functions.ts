import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { AIAlgorithmConfig } from "./types";

const MODEL = "gemini-2.5-flash";

const candidateSchema = z.object({
  id: z.string(),
  title: z.string(),
  channel: z.string().optional().default(""),
  views: z.number().optional().default(0),
  ageDays: z.number().optional().default(0),
});

async function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY غير مضبوط على السيرفر");
  const { GoogleGenAI } = await import("@google/genai");
  return new GoogleGenAI({ apiKey });
}

export const aiRerankFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        summary: z.string().max(2000),
        userPrompt: z.string().max(1000).optional(),
        candidates: z.array(candidateSchema).max(80),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<{ scores: Record<string, number>; reason?: string }> => {
    const ai = await getClient();

    const list = data.candidates
      .map((c, i) => `${i}|${c.id}|${c.title}|${c.channel}`)
      .join("\n");

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
      'أعد JSON فقط بالشكل: {"scores":{"<id>":<0-100>},"reason":"سطر واحد"}',
    ]
      .filter(Boolean)
      .join("\n");

    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    });

    const raw = (res.text ?? "").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw) as { scores?: Record<string, number>; reason?: string };

    const scores: Record<string, number> = {};
    for (const [id, v] of Object.entries(parsed.scores || {})) {
      const n = Number(v);
      if (Number.isFinite(n)) scores[id] = Math.max(0, Math.min(100, n)) / 100;
    }
    return { scores, reason: parsed.reason };
  });

export const aiTuneFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        userPrompt: z.string().min(2).max(1000),
        language: z.string().default("ar"),
        topInterests: z.array(z.string()).max(20).default([]),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<AIAlgorithmConfig> => {
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
      "مجموع weights يجب أن يساوي 1 تقريباً.",
    ].join("\n");

    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.4 },
    });

    const raw = (res.text ?? "").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw) as AIAlgorithmConfig;

    return {
      summary: parsed.summary || data.userPrompt,
      includeTopics: parsed.includeTopics || [],
      excludeTopics: parsed.excludeTopics || [],
      weights: parsed.weights,
      minDurationSec: parsed.minDurationSec ?? null,
      maxDurationSec: parsed.maxDurationSec ?? null,
      createdAt: new Date().toISOString(),
    };
  });
